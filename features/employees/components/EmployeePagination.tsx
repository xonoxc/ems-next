"use client"

import { useQueryClient } from "@tanstack/react-query"
import { employeesQueryOptions } from "@/features/employees/api/query-options"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { EmployeeQueryParams } from "@/features/employees/types"

interface EmployeePaginationProps {
   page: number
   totalPages: number
   total: number
   params: EmployeeQueryParams
   onPageChange: (page: number) => void
}

export function EmployeePagination({
   page,
   totalPages,
   total,
   params,
   onPageChange,
}: EmployeePaginationProps) {
   const queryClient = useQueryClient()

   if (totalPages <= 1) return null

   const prefetchNextPage = () => {
      queryClient.prefetchQuery(employeesQueryOptions({ ...params, page: page + 1 }))
   }

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
               onMouseEnter={prefetchNextPage}
            >
               Next
               <ChevronRight className="size-4" />
            </Button>
         </div>
      </div>
   )
}
