"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { employeesQueryOptions, employeeQueryOptions } from "@/features/employees/api/query-options"
import type { EmployeeQueryParams } from "@/features/employees/types"

export function useEmployees(params: EmployeeQueryParams) {
   return useSuspenseQuery(employeesQueryOptions(params))
}

export function useEmployee(id: string) {
   return useSuspenseQuery(employeeQueryOptions(id))
}
