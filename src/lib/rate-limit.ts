/**
 * Dependency-free in-memory rate limiter.
 *
 * Per-instance only — on serverless this resets with each cold start and is not
 * shared across regions. Good enough to blunt bulk enumeration and mailbombing;
 * swap for Redis/Upstash before opening signups widely.
 */

type Entry = { count: number; resetTime: number }

const g = globalThis as unknown as { __agencyos_rate_limit?: Map<string, Entry> }
if (!g.__agencyos_rate_limit) {
  g.__agencyos_rate_limit = new Map<string, Entry>()
}
const buckets = g.__agencyos_rate_limit

/** Returns true when the call is allowed, false when the bucket is exhausted. */
export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now > entry.resetTime) {
    buckets.set(key, { count: 1, resetTime: now + windowMs })
    // Opportunistic sweep so the map cannot grow unbounded across a long-lived
    // instance — cheap because it only runs on a fresh/expired bucket.
    if (buckets.size > 5_000) {
      for (const [k, v] of buckets) {
        if (now > v.resetTime) buckets.delete(k)
      }
    }
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}
