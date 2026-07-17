"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface EmployeePaginationProps {
   page: number
   totalPages: number
   total: number
   onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
   if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1)
   }

   const pages: (number | "ellipsis")[] = [1]

   if (current > 3) {
      pages.push("ellipsis")
   }

   const start = Math.max(2, current - 1)
   const end = Math.min(total - 1, current + 1)

   for (let i = start; i <= end; i++) {
      pages.push(i)
   }

   if (current < total - 2) {
      pages.push("ellipsis")
   }

   if (total > 1) {
      pages.push(total)
   }

   return pages
}

export function EmployeePagination({
   page,
   totalPages,
   total,
   onPageChange,
}: EmployeePaginationProps) {
   if (totalPages <= 1) return null

   const pages = getPageNumbers(page, totalPages)

   return (
      <div className="flex items-center justify-between">
         <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
         </p>
         <div className="flex items-center gap-1">
            <Button
               variant="outline"
               size="icon"
               className="size-8"
               disabled={page <= 1}
               onClick={() => onPageChange(page - 1)}
            >
               <ChevronLeft className="size-4" />
            </Button>
            {pages.map((p, i) =>
               p === "ellipsis" ? (
                  <span key={`ellipsis-${i}`} className="px-1">
                     <MoreHorizontal className="size-4 text-muted-foreground" />
                  </span>
               ) : (
                  <Button
                     key={p}
                     variant={p === page ? "default" : "outline"}
                     size="icon"
                     className="size-8"
                     onClick={() => onPageChange(p)}
                  >
                     {p}
                  </Button>
               )
            )}
            <Button
               variant="outline"
               size="icon"
               className="size-8"
               disabled={page >= totalPages}
               onClick={() => onPageChange(page + 1)}
            >
               <ChevronRight className="size-4" />
            </Button>
         </div>
      </div>
   )
}
