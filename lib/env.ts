import { z } from "zod"
import { attemptSync } from "./errors"

const envSchema = z.object({
   DATABASE_URL: z.url(),
   BETTER_AUTH_SECRET: z.string().min(16),
   BETTER_AUTH_URL: z.url(),
   NODE_ENV: z.enum(["development", "production", "test"]),
})

const envVars = {
   DATABASE_URL: process.env.DATABASE_URL,
   BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
   BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
   NODE_ENV: process.env.NODE_ENV,
}

export const env = attemptSync(() => envSchema.parse(envVars)).match(
   parsed => parsed,
   e => {
      console.error("Invalid environment variables:", e)
      throw new Error("Invalid environment variables")
   }
)
