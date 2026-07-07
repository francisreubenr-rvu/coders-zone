import { NextRequest } from "next/server";

// Per-instance in-memory token bucket. Good enough for a low-traffic personal
// deployment: it protects the shared Paiza guest key and the paid AI keys from
// casual scripted abuse without pulling in Redis/Upstash infra this app doesn't
// otherwise need. Resets on cold start / across instances — not a hard guarantee.
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/** Allow `limit` requests per `windowMs` per client IP, keyed per named bucket. */
export function rateLimit(req: NextRequest, bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function tooManyRequests() {
  return Response.json({ error: "Too many requests — slow down and try again shortly." }, { status: 429 });
}

export function payloadTooLarge() {
  return Response.json({ error: "Submitted code is too large." }, { status: 413 });
}

/** Reject strings over the size cap (source code / free-text problem descriptions). */
export function tooLarge(...values: string[]): boolean {
  const MAX_CHARS = 20_000;
  return values.some((v) => v.length > MAX_CHARS);
}
