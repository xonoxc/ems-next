"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function OrgTreeSkeleton() {
   return (
      <div className="rounded-lg border bg-card p-4 space-y-2">
         {Array.from({ length: 8 }).map((_, i) => (
            <div
               key={i}
               className="flex items-center gap-3 px-3 py-2"
               style={{ paddingLeft: `${Math.min(i, 3) * 24 + 12}px` }}
            >
               <Skeleton className="size-5 shrink-0 rounded" />
               <Skeleton className="size-8 shrink-0 rounded-full" />
               <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
               </div>
            </div>
         ))}
      </div>
   )
}
