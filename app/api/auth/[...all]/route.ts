import { auth } from "@/server/auth/config"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth)
