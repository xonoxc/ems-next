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

const envVars = {
   DATABASE_URL: process.env.DATABASE_URL,
   BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
   BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
   NODE_ENV: process.env.NODE_ENV,
   BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
   UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
   UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
}

export const env = attemptSync(() => envSchema.parse(envVars)).match(
   parsed => parsed,
   e => {
      console.error("Invalid environment variables:", e)
      throw new Error("Invalid environment variables")
   }
)
