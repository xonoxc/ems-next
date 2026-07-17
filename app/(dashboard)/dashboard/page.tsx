import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { DashboardClient } from "./client"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"

export default async function DashboardPage() {
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery(dashboardSummaryQueryOptions())

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <DashboardClient />
         </div>
      </HydrationBoundary>
   )
}
