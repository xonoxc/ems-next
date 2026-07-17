"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import {
   employeesQueryOptions,
   employeeQueryOptions,
   reporteesQueryOptions,
} from "@/features/employees/api/query-options"
import type { EmployeeQueryParams } from "@/features/employees/types"

export function useEmployees(params: EmployeeQueryParams) {
   return useQuery(employeesQueryOptions(params))
}

export function useEmployee(id: string) {
   return useSuspenseQuery(employeeQueryOptions(id))
}

export function useReportees(managerId: string) {
   return useQuery(reporteesQueryOptions(managerId))
}
