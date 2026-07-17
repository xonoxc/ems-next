"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { importEmployees } from "@/features/employees/server/actions"

export function useImportEmployees() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (data: unknown[]) => importEmployees(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
         queryClient.invalidateQueries({ queryKey: ["organization", "tree"] })
      },
   })
}
