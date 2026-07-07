import { NextRequest } from "next/server";
import { generateText, aiConfigured, parseJsonReply } from "@/lib/ai";
import { getProblem, type Lang } from "@/lib/problems";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const LANG_LABEL: Record<Lang, string> = { python: "Python", c: "C", cpp: "C++", java: "Java" };

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "explain", 15, 60_000)) return tooManyRequests();

  const { slug, language } = await req.json();
  const problem = getProblem(slug);
  if (!problem) return Response.json({ error: "Unknown problem" }, { status: 404 });

  const lang = (language as Lang) in LANG_LABEL ? (language as Lang) : "python";

  // No AI provider → serve the hand-written explanation. Keeps the app fully usable.
  if (!aiConfigured()) {
    return Response.json({ ...problem.explanation, source: "builtin" });
  }

  try {
    const prompt = `You are a patient CS tutor for a beginner. Explain the reference solution to a coding problem in exactly four short paragraphs.

Problem: ${problem.title}
Statement: ${problem.statement}
Language: ${LANG_LABEL[lang]}
Reference solution:
\`\`\`
${problem.solution[lang]}
\`\`\`

Reply with ONLY a JSON object (no markdown, no code fences) with these string keys:
- "intuition": the plain-language idea before any code — the shape of the problem and why the approach works.
- "approach": the plan in words — data structure, the key step repeated.
- "walkthrough": a line-by-line prose walkthrough of THIS ${LANG_LABEL[lang]} solution. Not code comments — sentences.
- "complexity": time and space complexity, each with the reason, not just big-O letters.
Keep each value to 2-4 sentences, warm and concrete.`;

    const text = await generateText(prompt, 1600);
    const parsed = parseJsonReply(text);
    if (parsed && parsed.intuition && parsed.approach && parsed.walkthrough && parsed.complexity) {
      return Response.json({
        intuition: String(parsed.intuition),
        approach: String(parsed.approach),
        walkthrough: String(parsed.walkthrough),
        complexity: String(parsed.complexity),
        source: "ai",
      });
    }
    return Response.json({ ...problem.explanation, source: "builtin" });
  } catch {
    return Response.json({ ...problem.explanation, source: "builtin" });
  }
}
