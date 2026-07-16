import { authClient } from "@/lib/auth-client"

export function useSession() {
   const { data: session, isPending, error, refetch } = authClient.useSession()

   const signIn = async (email: string, password: string) => {
      return authClient.signIn.email({ email, password })
   }

   const signOut = async () => {
      return authClient.signOut()
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
