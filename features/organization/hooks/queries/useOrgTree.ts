"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { orgTreeQueryOptions } from "@/features/organization/api/query-options"

export function useOrgTree() {
   return useQuery({
      ...orgTreeQueryOptions(),
      placeholderData: keepPreviousData,
   })
}
