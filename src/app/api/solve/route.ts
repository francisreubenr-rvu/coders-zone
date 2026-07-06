import { NextRequest } from "next/server";
import { generateText, aiConfigured, parseJsonReply } from "@/lib/ai";
import type { Lang } from "@/lib/problems";
import { rateLimit, tooManyRequests, tooLarge, payloadTooLarge } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const LANG_LABEL: Record<Lang, string> = { python: "Python", c: "C", cpp: "C++", java: "Java" };

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "solve", 10, 60_000)) return tooManyRequests();

  const { problem, attempt, language } = await req.json();
  if (!problem || typeof problem !== "string" || !problem.trim()) {
    return Response.json({ error: "Describe a problem first." }, { status: 400 });
  }
  if (!attempt || typeof attempt !== "string" || !attempt.trim()) {
    return Response.json({ error: "Show your own attempt first — even a partial or wrong one — before the solver will help." }, { status: 400 });
  }
  if (tooLarge(problem, attempt)) return payloadTooLarge();
  const lang: Lang = (language as Lang) in LANG_LABEL ? (language as Lang) : "python";

  if (!aiConfigured()) {
    return Response.json({
      needsKey: true,
      error:
        "The AI Solver needs a (free) AI key to run. Add a Google Gemini key as GEMINI_API_KEY — it's free with no credit card. Until then, the Practice tab has ready-made verified solutions and explanations.",
    });
  }

  try {
    const prompt = `A student gives you a programming problem and their own attempt at solving it. Write a correct, complete solution in ${LANG_LABEL[lang]} and explain it.

The program must read any input from standard input and print the answer to standard output (${LANG_LABEL[lang]} conventions${lang === "java" ? "; the public class must be named Main" : ""}).

Problem from the student:
"""
${problem.slice(0, 4000)}
"""

The student's own attempt (may be partial, wrong, or pseudocode):
"""
${attempt.slice(0, 4000)}
"""

Reply with ONLY a JSON object (no markdown fences) with keys:
- "code": the full runnable ${LANG_LABEL[lang]} program as a single string.
- "explanation": 4-6 sentences, beginner-friendly. Start by briefly noting what the student's attempt got right or where it went wrong, then explain the idea and key steps of the correct solution.
- "complexity": time and space complexity with the reason.`;

    const text = await generateText(prompt, 2000);
    const parsed = parseJsonReply(text);
    if (parsed && parsed.code) {
      return Response.json({
        code: String(parsed.code),
        explanation: String(parsed.explanation || ""),
        complexity: String(parsed.complexity || ""),
        language: lang,
        source: "ai",
      });
    }
    return Response.json({ error: "The solver couldn't format a solution. Try rephrasing the problem." }, { status: 502 });
  } catch (e) {
    return Response.json({ error: `Solver error: ${(e as Error).message}` }, { status: 502 });
  }
}
