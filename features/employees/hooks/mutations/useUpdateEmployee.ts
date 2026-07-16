"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EmployeeApiClient } from "@/features/employees/api/api-client"
import type { UpdateEmployeeInput } from "@/features/employees/types"

export function useUpdateEmployee(id: string) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (data: UpdateEmployeeInput) => EmployeeApiClient.update(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
         queryClient.invalidateQueries({ queryKey: ["employees", id] })
      },
   })
}
