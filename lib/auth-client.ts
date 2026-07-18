import { createAuthClient } from "better-auth/react"

const rawUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? ""
const baseURL = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`

export const authClient = createAuthClient({
   baseURL,
})
