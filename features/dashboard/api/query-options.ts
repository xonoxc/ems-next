import { queryOptions } from "@tanstack/react-query"
import { DashboardApiClient } from "./api-client"

export function dashboardSummaryQueryOptions() {
   return queryOptions({
      queryKey: ["dashboard", "summary"],
      queryFn: () => DashboardApiClient.getSummary(),
   })
}
