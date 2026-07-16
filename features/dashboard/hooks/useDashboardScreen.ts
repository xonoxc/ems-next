"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"

export function useDashboardScreen() {
   const query = useSuspenseQuery(dashboardSummaryQueryOptions())

   return {
      query,
      data: query.data,
   }
}
