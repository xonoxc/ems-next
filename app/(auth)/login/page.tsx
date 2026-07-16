"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginInput } from "@/features/auth/schemas"
import { useSession } from "@/features/auth/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
   const router = useRouter()
   const { session, isPending: sessionLoading, signIn } = useSession()
   const [isSubmitting, setIsSubmitting] = useState(false)

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginInput>({
      resolver: zodResolver(LoginSchema),
   })

   useEffect(() => {
      if (session?.user) {
         router.push("/dashboard")
      }
   }, [session, router])

   async function onSubmit(data: LoginInput) {
      setIsSubmitting(true)
      try {
         const result = await signIn(data.email, data.password)
         if (result.error) {
            toast.error(result.error.message ?? "Invalid credentials")
            return
         }
         router.push("/dashboard")
      } catch {
         toast.error("An unexpected error occurred")
      } finally {
         setIsSubmitting(false)
      }
   }

   if (sessionLoading) {
      return (
         <div className="flex items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
      )
   }

   if (session?.user) {
      return null
   }

   return (
      <div className="w-full max-w-sm space-y-6 px-4">
         <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground">
               Enter your credentials to access the dashboard
            </p>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
               </label>
               <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="name@example.com"
                  {...register("email")}
               />
               {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
               <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
               </label>
               <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your password"
                  {...register("password")}
               />
               {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
               )}
            </div>

            <button
               type="submit"
               disabled={isSubmitting}
               className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
               {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
         </form>

         <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
               Back to home
            </Link>
         </p>
      </div>
   )
}
