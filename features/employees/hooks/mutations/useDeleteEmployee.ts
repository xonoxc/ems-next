"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EmployeeApiClient } from "@/features/employees/api/api-client"

export function useDeleteEmployee() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: string) => EmployeeApiClient.delete(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
      },
   })
}
