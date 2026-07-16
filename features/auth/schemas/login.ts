import { z } from "zod"

export const LoginSchema = z.object({
   email: z.email({ error: "Please enter a valid email address" }),
   password: z
      .string({ error: "Password is required" })
      .min(8, { error: "Password must be at least 8 characters" }),
})

export type LoginInput = z.infer<typeof LoginSchema>
