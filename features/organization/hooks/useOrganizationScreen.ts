"use client"

import { useOrgTree } from "./queries/useOrgTree"

export function useOrganizationScreen() {
   const query = useOrgTree()

   return {
      query,
      data: query.data,
   }
}
