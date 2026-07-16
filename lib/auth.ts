import { headers } from "next/headers"
import { auth } from "@/server/auth/config"
import { attempt } from "./errors"
import { ok, err } from "neverthrow"

export async function getSession() {
   const session = await auth.api.getSession({
      headers: await headers(),
   })
   return session
}

type AuthError = { status: number; message: string }

export async function requireSession() {
   const sessionResult = await attempt(getSession())

   return sessionResult
      .mapErr((): AuthError => ({ status: 500, message: "Authentication check failed" }))
      .andThen(session => {
         if (!session) {
            return err({ status: 401, message: "Unauthorized" } satisfies AuthError)
         }
         return ok(session)
      })
}
