"use client"

import { useEmployee } from "./queries/useEmployees"

export function useEmployeeScreen(id: string) {
   const result = useEmployee(id)

   return {
      query: result,
      employee: result.data,
   }
}
