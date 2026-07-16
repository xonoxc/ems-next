import { queryOptions } from "@tanstack/react-query"
import { EmployeeApiClient } from "./api-client"
import type { EmployeeQueryParams } from "@/features/employees/types"

export function employeesQueryOptions(params: EmployeeQueryParams) {
   return queryOptions({
      queryKey: ["employees", params],
      queryFn: () => EmployeeApiClient.findMany(params),
   })
}

export function employeeQueryOptions(id: string) {
   return queryOptions({
      queryKey: ["employees", id],
      queryFn: () => EmployeeApiClient.findById(id),
   })
}
