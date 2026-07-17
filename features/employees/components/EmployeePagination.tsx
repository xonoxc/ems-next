"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface EmployeePaginationProps {
   page: number
   totalPages: number
   total: number
   onPageChange: (page: number) => void
}

export function EmployeePagination({
   page,
   totalPages,
   total,
   onPageChange,
}: EmployeePaginationProps) {
   if (totalPages <= 1) return null

   return (
      <div className="flex items-center justify-between">
         <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
         </p>
         <div className="flex gap-1">
            <Button
               variant="outline"
               size="sm"
               disabled={page <= 1}
               onClick={() => onPageChange(page - 1)}
            >
               <ChevronLeft className="size-4" />
               Previous
            </Button>
            <Button
               variant="outline"
               size="sm"
               disabled={page >= totalPages}
               onClick={() => onPageChange(page + 1)}
            >
               Next
               <ChevronRight className="size-4" />
            </Button>
         </div>
      </div>
   )
}
