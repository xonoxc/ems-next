"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export function useSession() {
   const router = useRouter()
   const { data: session, isPending, error, refetch } = authClient.useSession()

   const signIn = async (email: string, password: string) => {
      try {
         console.log("[useSession] signIn attempt for:", email)
         const result = await authClient.signIn.email({ email, password })
         console.log("[useSession] signIn result:", JSON.stringify(result, null, 2))
         return result
      } catch (err) {
         console.error("[useSession] signIn error:", err)
         throw err
      }
   }

   const signOut = async () => {
      const toastId = toast.loading("Logging out...")
      await authClient.signOut()
      toast.success("Logged out", { id: toastId })
      router.push("/login")
   }

   return {
      session,
      isPending,
      error,
      refetch,
      signIn,
      signOut,
      user: session?.user ?? null,
   }
}
