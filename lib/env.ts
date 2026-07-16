import { z } from "zod"
import { attemptSync } from "./errors"

const envSchema = z.object({
   DATABASE_URL: z.url(),
   BETTER_AUTH_SECRET: z.string().min(16),
   BETTER_AUTH_URL: z.url(),
   NODE_ENV: z.enum(["development", "production", "test"]),
   BLOB_READ_WRITE_TOKEN: z.string().optional(),
   UPSTASH_REDIS_REST_URL: z.string().optional(),
   UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
})

export const env = attemptSync(() => envSchema.parse(process.env)).match(
   parsed => parsed,
   () => {
      throw new Error("Invalid environment variables")
   }
)
