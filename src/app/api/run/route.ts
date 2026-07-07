import { NextRequest } from "next/server";
import { runCode } from "@/lib/piston";
import type { Lang } from "@/lib/problems";
import { rateLimit, tooManyRequests, tooLarge, payloadTooLarge } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!rateLimit(req, "run", 20, 60_000)) return tooManyRequests();

  const { language, source, stdin } = await req.json();
  if (!language || typeof source !== "string") {
    return Response.json({ error: "language and source are required" }, { status: 400 });
  }
  if (tooLarge(source, typeof stdin === "string" ? stdin : "")) return payloadTooLarge();

  const result = await runCode(language as Lang, source, typeof stdin === "string" ? stdin : "");
  return Response.json(result);
}
