"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"

export function useDashboardSummary() {
   return useQuery({
      ...dashboardSummaryQueryOptions(),
      placeholderData: keepPreviousData,
   })
}
