import { queryOptions, keepPreviousData } from "@tanstack/react-query"
import { EmployeeApiClient } from "./api-client"
import type { EmployeeQueryParams } from "@/features/employees/types"

export function employeesQueryOptions(params: EmployeeQueryParams) {
   return queryOptions({
      queryKey: ["employees", params],
      queryFn: () => EmployeeApiClient.findMany(params),
      placeholderData: keepPreviousData,
   })
}

export function employeeQueryOptions(id: string) {
   return queryOptions({
      queryKey: ["employees", id],
      queryFn: () => EmployeeApiClient.findById(id),
   })
}

export function reporteesQueryOptions(managerId: string) {
   return queryOptions({
      queryKey: ["employees", managerId, "reportees"],
      queryFn: () => EmployeeApiClient.findReportees(managerId),
   })
}
