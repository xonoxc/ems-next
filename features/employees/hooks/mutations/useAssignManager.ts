"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { EmployeeApiClient } from "@/features/employees/api/api-client"

export function useAssignManager() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ employeeId, managerId }: { employeeId: string; managerId: string }) =>
         EmployeeApiClient.assignManager(employeeId, managerId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["employees"] })
      },
   })
}
