"use client"

import { useState, useCallback } from "react"
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"
import { useOrganizationScreen } from "@/features/organization/hooks/useOrganizationScreen"

export function useOrganizationFilters() {
   const { data, query } = useOrganizationScreen()
   const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
   const [maxDepth, setMaxDepthRaw] = useQueryState("depth", parseAsInteger.withDefault(10))
   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

   const setSearchWithHistory = useCallback(
      (value: string | null) => setSearch(value, { history: "push" }),
      [setSearch]
   )
   const setMaxDepth = useCallback(
      (value: number | null) => setMaxDepthRaw(value, { history: "push" }),
      [setMaxDepthRaw]
   )

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
         return nodes ? nodes.flatMap(n => [n.id, ...collectIds(n.children)]) : []
      }
      setExpandedIds(new Set(collectIds(data)))
   }, [data])

   const collapseAll = useCallback(() => setExpandedIds(new Set()), [])

   return {
      query,
      data,
      search,
      setSearch: setSearchWithHistory,
      maxDepth,
      setMaxDepth,
      expandedIds,
      toggleNode,
      expandAll,
      collapseAll,
   }
}
