"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateEmployee } from "@/features/employees/server/actions"
import type { UpdateEmployeeInput } from "@/features/employees/types"

export function useUpdateEmployee() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) =>
         updateEmployee(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
      },
   })
}
