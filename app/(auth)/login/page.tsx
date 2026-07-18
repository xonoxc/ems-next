"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginInput } from "@/features/auth/schemas"
import { useSession } from "@/features/auth/hooks"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { attempt } from "@/lib/errors"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
   return (
      <Suspense
         fallback={
            <div className="flex items-center justify-center">
               <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
         }
      >
         <LoginForm />
      </Suspense>
   )
}

function LoginForm() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const { session, isPending: sessionLoading, signIn, refetch } = useSession()
   const [isSubmitting, setIsSubmitting] = useState(false)

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginInput>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
         email: searchParams.get("email") ?? "",
         password: searchParams.get("password") ?? "",
      },
   })

   useEffect(() => {
      if (session?.user) {
         router.push("/dashboard")
      }
   }, [session, router])

   async function onSubmit(data: LoginInput) {
      setIsSubmitting(true)
      try {
         const result = await attempt(signIn(data.email, data.password))
         if (result.isErr()) {
            toast.error("An unexpected error occurred")
            return
         }

         if (result.value.error) {
            toast.error(result.value.error.message ?? "Invalid credentials")
            return
         }
         await refetch()
         router.push("/dashboard")
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
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  {...register("email")}
               />
               {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password")}
               />
               {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
               )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
               {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
         </form>

         <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
               Back to home
            </Link>
         </p>
      </div>
   )
}
