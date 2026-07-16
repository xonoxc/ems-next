"use client"

import { useSession } from "@/features/auth/hooks"

export function DashboardHeader() {
   const { user } = useSession()

   return (
      <div>
         <h1 className="text-2xl font-bold">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
         <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening in your organization today.
         </p>
      </div>
   )
}
