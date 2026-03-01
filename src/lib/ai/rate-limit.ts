type RateLimitInfo = { count: number; windowStart: number }

// In-memory cache based on Maps. In serverless this might reset per-instance,
// but it is sufficient for basic MVP abuse detection without Redis.
const ipCache = new Map<string, RateLimitInfo>()
const WINDOW_MS = 60 * 1000 // 1 min window
const MAX_REQ = 60 // Max 60 requests per minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const info = ipCache.get(ip) || { count: 0, windowStart: now }

  if (now - info.windowStart > WINDOW_MS) {
    info.count = 1
    info.windowStart = now
  } else {
    info.count += 1
  }

  ipCache.set(ip, info)

  // Opróżnianie cache (garbage collection prymitywny by nie wyciekło na długim runtime Node'a)
  if (ipCache.size > 1000) {
    const oldestLimit = now - WINDOW_MS
    Array.from(ipCache.entries()).forEach(([key, val]) => {
      if (val.windowStart < oldestLimit) ipCache.delete(key)
    })
  }

  return info.count <= MAX_REQ
}
