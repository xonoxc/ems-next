import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { DashboardService } from "@/features/dashboard/server/service"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"
import { DashboardClient } from "./client"

export default async function DashboardPage() {
   const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 30_000 } },
   })
   await queryClient.prefetchQuery({
      ...dashboardSummaryQueryOptions(),
      queryFn: async () => {
         const result = await DashboardService.getSummary()
         if (result.isErr()) {
            throw new Error(result.error.message)
         }
         return result.value
      },
   })

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <DashboardClient />
         </div>
      </HydrationBoundary>
   )
}
