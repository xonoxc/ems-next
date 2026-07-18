"use client"

import { useOrganizationFilters } from "@/features/organization/hooks/useOrganizationFilters"
import { OrgTree } from "@/features/organization/components/OrgTree"
import { OrgTreeControls } from "@/features/organization/components/OrgTreeControls"

export function OrganizationClient() {
   const {
      query,
      data,
      search,
      setSearch,
      maxDepth,
      setMaxDepth,
      expandedIds,
      toggleNode,
      expandAll,
      collapseAll,
   } = useOrganizationFilters()

   return (
      <div className={`space-y-4 ${query.isPending ? "opacity-60 pointer-events-none" : ""}`}>
         <OrgTreeControls
            search={search}
            onSearchChange={setSearch}
            maxDepth={maxDepth}
            onMaxDepthChange={setMaxDepth}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
         />
         <OrgTree
            nodes={data ?? []}
            search={search}
            expandedIds={expandedIds}
            maxDepth={maxDepth}
            onToggle={toggleNode}
         />
      </div>
   )
}
