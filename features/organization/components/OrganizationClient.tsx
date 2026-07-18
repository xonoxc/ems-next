"use client"

import { useState } from "react"
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"
import { useOrganizationScreen } from "@/features/organization/hooks/useOrganizationScreen"
import { OrgTree } from "@/features/organization/components/OrgTree"
import { OrgTreeControls } from "@/features/organization/components/OrgTreeControls"

export function OrganizationClient() {
   const { data, query } = useOrganizationScreen()
   const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
   const [maxDepth, setMaxDepthRaw] = useQueryState("depth", parseAsInteger.withDefault(10))
   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

   const setSearchWithHistory = (value: string | null) => setSearch(value, { history: "push" })
   const setMaxDepth = (value: number | null) => setMaxDepthRaw(value, { history: "push" })

   const toggleNode = (id: string) => {
      setExpandedIds(prev => {
         const next = new Set(prev)
         if (next.has(id)) {
            next.delete(id)
         } else {
            next.add(id)
         }
         return next
      })
   }

   const expandAll = () => {
      const collectIds = (nodes: typeof data): string[] => {
         return nodes ? nodes.flatMap(n => [n.id, ...collectIds(n.children)]) : []
      }
      setExpandedIds(new Set(collectIds(data)))
   }

   const collapseAll = () => setExpandedIds(new Set())

   return (
      <div className={`space-y-4 ${query.isPending ? "opacity-60 pointer-events-none" : ""}`}>
         <OrgTreeControls
            search={search}
            onSearchChange={setSearchWithHistory}
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
