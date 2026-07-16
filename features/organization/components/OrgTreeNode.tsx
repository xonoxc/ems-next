"use client"

import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { OrgTreeNode } from "@/features/organization/api/api-client"

interface OrgTreeNodeProps {
   node: OrgTreeNode
   search: string
   expandedIds: Set<string>
   depth: number
   maxDepth: number
   onToggle: (id: string) => void
}

function matchesSearch(node: OrgTreeNode, search: string): boolean {
   if (!search) return true
   const s = search.toLowerCase()
   return (
      node.firstName.toLowerCase().includes(s) ||
      node.lastName.toLowerCase().includes(s) ||
      node.designation.toLowerCase().includes(s) ||
      node.department.toLowerCase().includes(s)
   )
}

function hasMatchingDescendant(node: OrgTreeNode, search: string): boolean {
   if (!search) return true
   if (matchesSearch(node, search)) return true
   return node.children.some(child => hasMatchingDescendant(child, search))
}

export function OrgTreeNodeComponent({
   node,
   search,
   expandedIds,
   depth,
   maxDepth,
   onToggle,
}: OrgTreeNodeProps) {
   const isExpanded = expandedIds.has(node.id)
   const hasChildren = node.children.length > 0
   const initials = `${node.firstName[0]}${node.lastName[0]}`
   const isHidden = search && !hasMatchingDescendant(node, search)
   const isMaxDepth = depth >= maxDepth

   if (isHidden) return null

   return (
      <div>
         <div
            className={cn(
               "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/50",
               depth > 0 && "ml-6"
            )}
            style={{ paddingLeft: `${depth * 24 + 12}px` }}
         >
            {hasChildren && !isMaxDepth ? (
               <button
                  onClick={() => onToggle(node.id)}
                  className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
               >
                  {isExpanded ? (
                     <ChevronDown className="size-4" />
                  ) : (
                     <ChevronRight className="size-4" />
                  )}
               </button>
            ) : (
               <span className="size-5 shrink-0" />
            )}

            <Avatar className="size-8">
               <AvatarImage src={node.profileImage ?? undefined} alt={node.firstName} />
               <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
               <span className="font-medium">
                  {node.firstName} {node.lastName}
               </span>
               <span className="text-xs text-muted-foreground">
                  {node.designation} · {node.department}
               </span>
            </div>
         </div>

         {isExpanded &&
            hasChildren &&
            node.children.map(child => (
               <OrgTreeNodeComponent
                  key={child.id}
                  node={child}
                  search={search}
                  expandedIds={expandedIds}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onToggle={onToggle}
               />
            ))}
      </div>
   )
}
