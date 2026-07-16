"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { orgTreeQueryOptions } from "@/features/organization/api/query-options"

export function useOrgTree() {
   return useSuspenseQuery(orgTreeQueryOptions())
}
