import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { DashboardClient } from "./client"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"
import { employeesQueryOptions } from "@/features/employees/api/query-options"

export default async function DashboardPage() {
   const queryClient = new QueryClient()

   await Promise.all([
      queryClient.prefetchQuery(dashboardSummaryQueryOptions()),
      queryClient.prefetchQuery(
         employeesQueryOptions({ page: 1, pageSize: 10, sortBy: "createdAt", sortOrder: "desc" })
      ),
   ])

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <DashboardClient />
         </div>
      </HydrationBoundary>
   )
}
