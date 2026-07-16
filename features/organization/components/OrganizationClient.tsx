"use client"

import { useState, useCallback } from "react"
import { useOrganizationScreen } from "@/features/organization/hooks/useOrganizationScreen"
import { OrgTree } from "@/features/organization/components/OrgTree"
import { OrgTreeControls } from "@/features/organization/components/OrgTreeControls"
import { OrgTreeSkeleton } from "@/features/organization/components/OrgTreeSkeleton"
import { Suspense } from "react"

export function OrganizationClient() {
   const { data } = useOrganizationScreen()
   const [search, setSearch] = useState("")
   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
   const [maxDepth, setMaxDepth] = useState(10)

   const toggleNode = useCallback((id: string) => {
      setExpandedIds(prev => {
         const next = new Set(prev)
         if (next.has(id)) {
            next.delete(id)
         } else {
            next.add(id)
         }
         return next
      })
   }, [])

   const expandAll = useCallback(() => {
      const collectIds = (nodes: typeof data): string[] => {
         return nodes.flatMap(n => [n.id, ...collectIds(n.children)])
      }
      setExpandedIds(new Set(collectIds(data)))
   }, [data])

   const collapseAll = useCallback(() => {
      setExpandedIds(new Set())
   }, [])

   return (
      <div className="space-y-4">
         <OrgTreeControls
            search={search}
            onSearchChange={setSearch}
            maxDepth={maxDepth}
            onMaxDepthChange={setMaxDepth}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
         />
         <Suspense fallback={<OrgTreeSkeleton />}>
            <OrgTree
               nodes={data}
               search={search}
               expandedIds={expandedIds}
               maxDepth={maxDepth}
               onToggle={toggleNode}
            />
         </Suspense>
      </div>
   )
}
