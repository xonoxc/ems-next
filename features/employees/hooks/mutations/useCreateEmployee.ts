"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEmployee } from "@/features/employees/server/actions"
import type { CreateEmployeeInput } from "@/features/employees/types"

export function useCreateEmployee() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (data: CreateEmployeeInput) => createEmployee(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
         queryClient.invalidateQueries({ queryKey: ["organization", "tree"] })
      },
   })
}
