"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteEmployee } from "@/features/employees/server/actions"

export function useDeleteEmployee() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: string) => deleteEmployee(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
         queryClient.invalidateQueries({ queryKey: ["organization", "tree"] })
      },
   })
}
