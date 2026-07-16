interface TokenBucket {
   tokens: number
   lastRefill: number
}

const buckets = new Map<string, TokenBucket>()

export interface RateLimitResult {
   allowed: boolean
   retryAfter: number | null
}

export function rateLimit(
   key: string,
   maxTokens: number,
   windowMs: number
): RateLimitResult {
   const now = Date.now()
   const bucket = buckets.get(key) ?? { tokens: maxTokens, lastRefill: now }

   const elapsed = now - bucket.lastRefill
   const refillAmount = (elapsed / windowMs) * maxTokens
   bucket.tokens = Math.min(maxTokens, bucket.tokens + refillAmount)
   bucket.lastRefill = now

   if (bucket.tokens < 1) {
      const retryAfter = Math.ceil((windowMs - elapsed) / 1000)
      return { allowed: false, retryAfter }
   }

   bucket.tokens -= 1
   buckets.set(key, bucket)
   return { allowed: true, retryAfter: null }
}
