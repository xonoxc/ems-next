"use client"

import { useState, useEffect, useEffectEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useQueryStates, parseAsString, parseAsInteger, parseAsStringEnum } from "nuqs"
import { useNavigateWithParams } from "@/hooks/use-navigate-with-params"
import { useEmployees } from "./queries/useEmployees"
import { employeesQueryOptions, employeeQueryOptions } from "@/features/employees/api/query-options"
import { useCreateEmployee } from "./mutations/useCreateEmployee"
import { useUpdateEmployee } from "./mutations/useUpdateEmployee"
import { useDeleteEmployee } from "./mutations/useDeleteEmployee"
import { attempt } from "@/lib/errors"
import { toast } from "sonner"
import type { Employee, CreateEmployeeInput } from "@/features/employees/types"
import type { Department, EmployeeStatus, EmployeeRole } from "@/features/employees/constants"

export function useEmployeesScreen() {
   const [filters, setFilters] = useQueryStates({
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
      sortBy: parseAsString.withDefault("createdAt"),
      sortOrder: parseAsStringEnum(["asc", "desc"]).withDefault("desc"),
      department: parseAsString.withDefault(""),
      status: parseAsString.withDefault(""),
      role: parseAsString.withDefault(""),
   })

   const [showForm, setShowForm] = useState(false)
   const [showImport, setShowImport] = useState(false)
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
   const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

   const createMutation = useCreateEmployee()
   const updateMutation = useUpdateEmployee()
   const deleteMutation = useDeleteEmployee()

   const setSearch = (value: string) => {
      setFilters({ search: value, page: 1 }, { history: "push" })
   }

   const setDepartment = (department: string | undefined) => {
      setFilters({ department: department || null, page: 1 }, { history: "push" })
   }

   const setStatus = (status: string | undefined) => {
      setFilters({ status: status || null, page: 1 }, { history: "push" })
   }

   const setRole = (role: string | undefined) => {
      setFilters({ role: role || null, page: 1 }, { history: "push" })
   }

   const setSortBy = (sortBy: string) => {
      setFilters({ sortBy })
   }

   const setSortOrder = (sortOrder: "asc" | "desc") => {
      setFilters({ sortOrder })
   }

   const setPage = (page: number) => {
      setFilters({ page })
   }

   const resetFilters = () => {
      setFilters(
         {
            search: null,
            page: null,
            pageSize: null,
            sortBy: null,
            sortOrder: null,
            department: null,
            status: null,
            role: null,
         },
         { history: "push" }
      )
   }

   const handleSort = (field: string) => {
      if (filters.sortBy === field) {
         setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })
      } else {
         setFilters({ sortBy: field, sortOrder: "asc" })
      }
   }

   const handleCreate = async (data: CreateEmployeeInput) => {
      const result = await attempt(createMutation.mutateAsync(data))
      result.match(
         () => {
            toast.success("Employee created successfully")
            setShowForm(false)
         },
         err => {
            toast.error(getErrorMessage(err, "Failed to create employee"))
         }
      )
   }

   const handleUpdate = async (data: CreateEmployeeInput) => {
      if (!editingEmployee) return
      const result = await attempt(
         updateMutation.mutateAsync({
            id: editingEmployee.id,
            data,
         })
      )
      result.match(
         () => {
            toast.success("Employee updated successfully")
            setEditingEmployee(null)
         },
         err => {
            toast.error(getErrorMessage(err, "Failed to update employee"))
         }
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
         err => {
            toast.error(getErrorMessage(err, "Failed to delete employee"))
         }
      )
   }

   const hasActiveFilters = !!(
      filters.search ||
      filters.department ||
      filters.status ||
      filters.role
   )

   const queryParams = {
      ...filters,
      search: filters.search || undefined,
      department: (filters.department || undefined) as Department | undefined,
      status: (filters.status || undefined) as EmployeeStatus | undefined,
      role: (filters.role || undefined) as EmployeeRole | undefined,
   }
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

   const { navigateTo } = useNavigateWithParams()

   const handleRowClick = (employee: { id: string }) => {
      navigateTo(`/employees/${employee.id}`)
   }

   const handleRowHover = (employee: { id: string }) => {
      queryClient.prefetchQuery({
         ...employeeQueryOptions(employee.id),
         staleTime: 60_000,
      })
   }

   return {
      query: result,
      filters,
      params: {
         ...filters,
         search: filters.search || undefined,
         department: (filters.department || undefined) as Department | undefined,
         status: (filters.status || undefined) as EmployeeStatus | undefined,
         role: (filters.role || undefined) as EmployeeRole | undefined,
      },
      search: filters.search,
      totalPages,
      isLoading: result.isLoading,
      isFetching: result.isFetching,
      setSearch,
      setDepartment,
      setStatus,
      setRole,
      setSortBy,
      setSortOrder,
      setPage,
      resetFilters,
      handleSort,
      hasActiveFilters,
      showForm,
      setShowForm,
      showImport,
      setShowImport,
      editingEmployee,
      setEditingEmployee,
      deletingEmployee,
      setDeletingEmployee,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleRowClick,
      handleRowHover,
      isSubmitting: createMutation.isPending || updateMutation.isPending,
   }
}
