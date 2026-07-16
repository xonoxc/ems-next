"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EmployeeApiClient } from "@/features/employees/api/api-client"
import type { CreateEmployeeInput } from "@/features/employees/types"

export function useCreateEmployee() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (data: CreateEmployeeInput) => EmployeeApiClient.create(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
      },
   })
}
