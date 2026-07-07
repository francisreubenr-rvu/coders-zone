import { NextRequest } from "next/server";
import { runCode } from "@/lib/piston";
import { getProblem, type Lang } from "@/lib/problems";
import { rateLimit, tooManyRequests, tooLarge, payloadTooLarge } from "@/lib/rate-limit";
import { norm } from "@/lib/normalize";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "judge", 20, 60_000)) return tooManyRequests();

  const { slug, language, source } = await req.json();
  const problem = getProblem(slug);
  if (!problem) return Response.json({ error: "Unknown problem" }, { status: 404 });
  if (!language || typeof source !== "string") {
    return Response.json({ error: "language and source are required" }, { status: 400 });
  }
  if (tooLarge(source)) return payloadTooLarge();

  // Each test recompiles the same source against a different stdin — run them
  // concurrently so wall-clock time is one Paiza round-trip, not N of them
  // (sequential execution here risked exceeding maxDuration on larger test sets).
  const outcomes = await Promise.all(problem.tests.map((t) => runCode(language as Lang, source, t.stdin)));

  const compileError = outcomes.find((r) => r.compileError)?.compileError;
  const message = !compileError ? outcomes.find((r) => r.message)?.message : undefined;

  const results: {
    index: number;
    hidden: boolean;
    passed: boolean;
    stdin?: string;
    expected?: string;
    got?: string;
    stderr?: string;
  }[] = [];

  let passed = 0;

  if (!compileError && !message) {
    for (let i = 0; i < problem.tests.length; i++) {
      const t = problem.tests[i];
      const r = outcomes[i];
      const ok = norm(r.stdout) === norm(t.expected);
      if (ok) passed++;
      results.push({
        index: i,
        hidden: !!t.hidden,
        passed: ok,
        ...(t.hidden
          ? {}
          : { stdin: t.stdin, expected: norm(t.expected), got: norm(r.stdout), stderr: r.stderr?.trim() || undefined }),
      });
    }
  }

  return Response.json({
    total: problem.tests.length,
    passed,
    allPassed: !compileError && !message && passed === problem.tests.length,
    compileError,
    message,
    results,
  });
}
