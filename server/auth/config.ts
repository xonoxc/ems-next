import { betterAuth } from "better-auth/minimal"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/lib/db"
import { env } from "@/lib/env"

export const auth = betterAuth({
   advanced: {
      database: {
         generateId: "uuid",
      },
   },
   database: drizzleAdapter(db, {
      provider: "pg",
      usePlural: true,
      camelCase: true,
   }),
   secret: env.BETTER_AUTH_SECRET,
   baseURL: env.BETTER_AUTH_URL,
   emailAndPassword: {
      enabled: true,
   },
   session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
   },
   plugins: [nextCookies()],
   user: {
      additionalFields: {
         role: {
            type: "string",
            defaultValue: "employee",
            required: false,
         },
      },
   },
   rateLimit: {
      window: 60,
      max: 100,
   },
})
