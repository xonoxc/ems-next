"use client"

import { useState } from "react"
import { useEmployees } from "./queries/useEmployees"
import type { EmployeeQueryParams } from "@/features/employees/types"
import type { Department, EmployeeStatus } from "@/features/employees/constants"

const DEFAULT_PARAMS: EmployeeQueryParams = {
   page: 1,
   pageSize: 10,
   sortBy: "createdAt",
   sortOrder: "desc",
}

export function useEmployeesScreen() {
   const [params, setParams] = useState<EmployeeQueryParams>(DEFAULT_PARAMS)

   const setSearch = (search: string) => {
      setParams((prev: EmployeeQueryParams) => ({ ...prev, search: search || undefined, page: 1 }))
   }

   const setDepartment = (department: string | undefined) => {
      setParams((prev: EmployeeQueryParams) => ({
         ...prev,
         department: department as Department | undefined,
         page: 1,
      }))
   }

   const setStatus = (status: string | undefined) => {
      setParams((prev: EmployeeQueryParams) => ({
         ...prev,
         status: status as EmployeeStatus | undefined,
         page: 1,
      }))
   }

   const setSortBy = (sortBy: string) => {
      setParams((prev: EmployeeQueryParams) => ({ ...prev, sortBy }))
   }

   const setSortOrder = (sortOrder: "asc" | "desc") => {
      setParams((prev: EmployeeQueryParams) => ({ ...prev, sortOrder }))
   }

   const setPage = (page: number) => {
      setParams((prev: EmployeeQueryParams) => ({ ...prev, page }))
   }

   const resetFilters = () => {
      setParams(DEFAULT_PARAMS)
   }

   const hasActiveFilters = !!(params.search || params.department || params.status)

   const result = useEmployees(params)

   return {
      query: result,
      params,
      totalPages: Math.ceil((result.data?.total ?? 0) / params.pageSize),
      setSearch,
      setDepartment,
      setStatus,
      setSortBy,
      setSortOrder,
      setPage,
      resetFilters,
      hasActiveFilters,
   }
}
