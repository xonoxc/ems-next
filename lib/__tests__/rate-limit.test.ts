import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { rateLimit } from "@/lib/rate-limit"

describe("rateLimit", () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })

   afterEach(() => {
      vi.useRealTimers()
   })

   it("allows within limit", () => {
      const result = rateLimit("test-key", 5, 60_000)
      expect(result.allowed).toBe(true)
      expect(result.retryAfter).toBeNull()
   })

   it("blocks over limit", () => {
      for (let i = 0; i < 5; i++) {
         rateLimit("test-limit", 5, 60_000)
      }
      const result = rateLimit("test-limit", 5, 60_000)
      expect(result.allowed).toBe(false)
      expect(result.retryAfter).toBeGreaterThan(0)
   })

   it("refills tokens after window", () => {
      for (let i = 0; i < 3; i++) {
         rateLimit("test-refill", 3, 1000)
      }
      const blocked = rateLimit("test-refill", 3, 1000)
      expect(blocked.allowed).toBe(false)

      vi.advanceTimersByTime(1100)

      const allowed = rateLimit("test-refill", 3, 1000)
      expect(allowed.allowed).toBe(true)
   })
})
