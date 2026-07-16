"use client"

import { Search, ChevronsUpDown, ChevronsDownUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface OrgTreeControlsProps {
   search: string
   onSearchChange: (value: string) => void
   maxDepth: number
   onMaxDepthChange: (value: number) => void
   onExpandAll: () => void
   onCollapseAll: () => void
}

export function OrgTreeControls({
   search,
   onSearchChange,
   maxDepth,
   onMaxDepthChange,
   onExpandAll,
   onCollapseAll,
}: OrgTreeControlsProps) {
   return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
               placeholder="Search employees..."
               value={search}
               onChange={e => onSearchChange(e.target.value)}
               className="pl-9"
            />
         </div>
         <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
               Depth: {maxDepth}
            </span>
            <Slider
               value={[maxDepth]}
               onValueChange={([v]) => onMaxDepthChange(v)}
               min={1}
               max={10}
               className="w-24"
            />
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onExpandAll}>
               <ChevronsUpDown className="mr-1 size-4" />
               Expand
            </Button>
            <Button variant="outline" size="sm" onClick={onCollapseAll}>
               <ChevronsDownUp className="mr-1 size-4" />
               Collapse
            </Button>
         </div>
      </div>
   )
}
