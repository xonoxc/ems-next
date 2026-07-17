import { Suspense } from "react"
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { OrganizationClient } from "@/features/organization/components/OrganizationClient"

export default async function OrganizationPage() {
   const queryClient = new QueryClient()

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <div>
               <h1 className="text-2xl font-bold">Organization</h1>
               <p className="text-muted-foreground">
                  View your organization&apos;s reporting structure
               </p>
            </div>
            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
               <OrganizationClient />
            </Suspense>
         </div>
      </HydrationBoundary>
   )
}
