import { describe, it, expect } from "vitest"
import { attempt, attemptSync } from "@/lib/errors"

describe("attempt", () => {
   it("returns Ok for resolved promise", async () => {
      const result = await attempt(Promise.resolve("hello"))
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
         expect(result.value).toBe("hello")
      }
   })

   it("returns Err for rejected promise", async () => {
      const result = await attempt(Promise.reject(new Error("fail")))
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error.message).toBe("fail")
      }
   })
})

describe("attemptSync", () => {
   it("returns Ok for successful function", () => {
      const result = attemptSync(() => 42)
      expect(result.isOk()).toBe(true)
      if (result.isOk()) {
         expect(result.value).toBe(42)
      }
   })

   it("returns Err for throwing function", () => {
      const result = attemptSync(() => {
         throw new Error("sync error")
      })
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error.message).toBe("sync error")
      }
   })
})
