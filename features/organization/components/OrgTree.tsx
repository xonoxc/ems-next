"use client"

import { OrgTreeNodeComponent } from "./OrgTreeNode"
import type { OrgTreeNode } from "@/features/organization/api/api-client"

interface OrgTreeProps {
   nodes: OrgTreeNode[]
   search: string
   expandedIds: Set<string>
   maxDepth: number
   onToggle: (id: string) => void
}

export function OrgTree({ nodes, search, expandedIds, maxDepth, onToggle }: OrgTreeProps) {
   if (nodes.length === 0) {
      return (
         <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">No organization data available</p>
         </div>
      )
   }

   return (
      <div className="rounded-lg border bg-card p-4">
         {nodes.map(node => (
            <OrgTreeNodeComponent
               key={node.id}
               node={node}
               search={search}
               expandedIds={expandedIds}
               depth={0}
               maxDepth={maxDepth}
               onToggle={onToggle}
            />
         ))}
      </div>
   )
}
