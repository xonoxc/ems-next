"use client"

import { useState, useEffect, useEffectEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useEmployees } from "./queries/useEmployees"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { employeesQueryOptions, employeeQueryOptions } from "@/features/employees/api/query-options"
import { useCreateEmployee } from "./mutations/useCreateEmployee"
import { useUpdateEmployee } from "./mutations/useUpdateEmployee"
import { useDeleteEmployee } from "./mutations/useDeleteEmployee"
import { attempt } from "@/lib/errors"
import { toast } from "sonner"
import type { EmployeeQueryParams, Employee, CreateEmployeeInput } from "@/features/employees/types"
import type { Department, EmployeeStatus } from "@/features/employees/constants"

const DEFAULT_PARAMS: EmployeeQueryParams = {
   page: 1,
   pageSize: 10,
   sortBy: "createdAt",
   sortOrder: "desc",
}

export function useEmployeesScreen() {
   const [search, setSearchRaw] = useState("")
   const debouncedSearch = useDebouncedValue(search, 300)
   const [filters, setFilters] = useState<EmployeeQueryParams>(DEFAULT_PARAMS)

   const [showForm, setShowForm] = useState(false)
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
   const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

   const createMutation = useCreateEmployee()
   const updateMutation = useUpdateEmployee("")
   const deleteMutation = useDeleteEmployee()

   const setSearch = (value: string) => {
      setSearchRaw(value)
      setFilters((prev: EmployeeQueryParams) => ({ ...prev, search: value || undefined, page: 1 }))
   }

   const setDepartment = (department: string | undefined) => {
      setFilters((prev: EmployeeQueryParams) => ({
         ...prev,
         department: department as Department | undefined,
         page: 1,
      }))
   }

   const setStatus = (status: string | undefined) => {
      setFilters((prev: EmployeeQueryParams) => ({
         ...prev,
         status: status as EmployeeStatus | undefined,
         page: 1,
      }))
   }

   const setSortBy = (sortBy: string) => {
      setFilters((prev: EmployeeQueryParams) => ({ ...prev, sortBy }))
   }

   const setSortOrder = (sortOrder: "asc" | "desc") => {
      setFilters((prev: EmployeeQueryParams) => ({ ...prev, sortOrder }))
   }

   const setPage = (page: number) => {
      setFilters((prev: EmployeeQueryParams) => ({ ...prev, page }))
   }

   const resetFilters = () => {
      setSearchRaw("")
      setFilters(DEFAULT_PARAMS)
   }

   const handleCreate = async (data: CreateEmployeeInput) => {
      const result = await attempt(createMutation.mutateAsync(data))
      result.match(
         () => {
            toast.success("Employee created successfully")
            setShowForm(false)
         },
         err => toast.error((err as Error).message ?? "Failed to create employee")
      )
   }

   const handleUpdate = async (data: CreateEmployeeInput) => {
      if (!editingEmployee) return
      const result = await attempt(updateMutation.mutateAsync(data))
      result.match(
         () => {
            toast.success("Employee updated successfully")
            setEditingEmployee(null)
         },
         err => toast.error((err as Error).message ?? "Failed to update employee")
      )
   }

   const handleDelete = async () => {
      if (!deletingEmployee) return
      const result = await attempt(deleteMutation.mutateAsync(deletingEmployee.id))
      result.match(
         () => {
            toast.success("Employee deleted successfully")
            setDeletingEmployee(null)
         },
         err => toast.error((err as Error).message ?? "Failed to delete employee")
      )
   }

   const hasActiveFilters = !!(search || filters.department || filters.status)

   const queryParams = { ...filters, search: debouncedSearch || undefined }
   const result = useEmployees(queryParams)
   const totalPages = Math.ceil((result.data?.total ?? 0) / filters.pageSize)

   const queryClient = useQueryClient()

   const prefetchNextPage = useEffectEvent(() => {
      if (totalPages > 1 && filters.page < totalPages) {
         queryClient.prefetchQuery(
            employeesQueryOptions({ ...queryParams, page: filters.page + 1 })
         )
      }
   })

   useEffect(() => {
      prefetchNextPage()
   }, [filters.page, totalPages])

   const prefetchVisibleDetails = useEffectEvent(() => {
      if (!result.data) return
      Promise.all(
         result.data.items.map(emp => queryClient.prefetchQuery(employeeQueryOptions(emp.id)))
      )
   })

   useEffect(() => {
      prefetchVisibleDetails()
   }, [result.data])

   return {
      query: result,
      params: { ...filters, search: debouncedSearch || undefined },
      search,
      totalPages,
      isLoading: result.isLoading,
      isFetching: result.isFetching,
      setSearch,
      setDepartment,
      setStatus,
      setSortBy,
      setSortOrder,
      setPage,
      resetFilters,
      hasActiveFilters,
      showForm,
      setShowForm,
      editingEmployee,
      setEditingEmployee,
      deletingEmployee,
      setDeletingEmployee,
      handleCreate,
      handleUpdate,
      handleDelete,
      isSubmitting: createMutation.isPending || updateMutation.isPending,
   }
}
