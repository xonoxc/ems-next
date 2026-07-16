"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { dashboardSummaryQueryOptions } from "@/features/dashboard/api/query-options"

export function useDashboardSummary() {
   return useSuspenseQuery(dashboardSummaryQueryOptions())
}
