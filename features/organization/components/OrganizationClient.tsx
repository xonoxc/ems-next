"use client"

import { useState, useCallback } from "react"
import { useOrganizationScreen } from "@/features/organization/hooks/useOrganizationScreen"
import { OrgTree } from "@/features/organization/components/OrgTree"
import { OrgTreeControls } from "@/features/organization/components/OrgTreeControls"

export function OrganizationClient() {
   const { data, query } = useOrganizationScreen()
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
            nodes={data}
            search={search}
            expandedIds={expandedIds}
            maxDepth={maxDepth}
            onToggle={toggleNode}
         />
      </div>
   )
}
