import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { DashboardClient } from "./client"

export default async function DashboardPage() {
   const queryClient = new QueryClient()

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <DashboardClient />
         </div>
      </HydrationBoundary>
   )
}
