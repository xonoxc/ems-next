"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignManager } from "@/features/employees/server/actions"

export function useAssignManager() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ employeeId, managerId }: { employeeId: string; managerId: string }) =>
         assignManager(employeeId, managerId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
      },
   })
}
