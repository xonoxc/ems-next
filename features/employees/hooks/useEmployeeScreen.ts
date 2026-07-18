"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEmployee, useEmployees, useReportees } from "./queries/useEmployees"
import { useUpdateEmployee } from "./mutations/useUpdateEmployee"
import { useDeleteEmployee } from "./mutations/useDeleteEmployee"
import { useAssignManager } from "./mutations/useAssignManager"
import { attempt } from "@/lib/errors"
import { toast } from "sonner"
import type { CreateEmployeeInput } from "@/features/employees/types"

export function useEmployeeScreen(id: string) {
   const router = useRouter()
   const result = useEmployee(id)

   const employeesQuery = useEmployees({
      page: 1,
      pageSize: 100,
      sortBy: "firstName",
      sortOrder: "asc",
   })
   const employees = employeesQuery.data?.items ?? []

   const reporteesQuery = useReportees(id)
   const reportees = reporteesQuery.data ?? []

   const employee = result.data
   const managerName = employee
      ? employees.find(m => m.id === employee.managerId)
         ? `${employees.find(m => m.id === employee.managerId)!.firstName} ${employees.find(m => m.id === employee.managerId)!.lastName}`
         : undefined
      : undefined

   const [editing, setEditing] = useState(false)
   const [deleting, setDeleting] = useState(false)
   const [assigningManager, setAssigningManager] = useState(false)

   const updateMutation = useUpdateEmployee()
   const deleteMutation = useDeleteEmployee()
   const assignManagerMutation = useAssignManager()

   const handleUpdate = async (data: CreateEmployeeInput) => {
      const result = await attempt(updateMutation.mutateAsync({ id, data }))
      result.match(
         () => {
            toast.success("Employee updated")
            setEditing(false)
         },
         err => {
            toast.error(err instanceof Error ? err.message : "Failed to update")
         }
      )
   }

   const handleDelete = async () => {
      const result = await attempt(deleteMutation.mutateAsync(id))
      result.match(
         () => {
            toast.success("Employee deleted")
            router.push("/employees")
         },
         err => {
            toast.error(err instanceof Error ? err.message : "Failed to delete")
         }
      )
   }

   const handleAssignManager = async (managerId: string) => {
      const result = await attempt(
         assignManagerMutation.mutateAsync({
            employeeId: id,
            managerId,
         })
      )
      result.match(
         () => {
            toast.success("Manager assigned")
            setAssigningManager(false)
         },
         err => {
            toast.error(err instanceof Error ? err.message : "Failed to assign manager")
         }
      )
   }

   return {
      query: result,
      employee,
      managerName,
      employees,
      reportees,
      editing,
      setEditing,
      deleting,
      setDeleting,
      assigningManager,
      setAssigningManager,
      handleUpdate,
      handleDelete,
      handleAssignManager,
      isSubmitting: updateMutation.isPending,
      isAssigningManager: assignManagerMutation.isPending,
   }
}
