"use client"

import { useState } from "react"
import { EmployeeTable } from "@/features/employees/components/EmployeeTable"
import { EmployeeFilters } from "@/features/employees/components/EmployeeFilters"
import { EmployeePagination } from "@/features/employees/components/EmployeePagination"
import { EmployeeForm } from "@/features/employees/components/EmployeeForm"
import { DeleteEmployeeDialog } from "@/features/employees/components/DeleteEmployeeDialog"
import { EmployeeEmptyState } from "@/features/employees/components/EmployeeEmptyState"
import { EmployeeTableSkeleton } from "@/features/employees/components/EmployeeSkeleton"
import { useEmployeesScreen } from "@/features/employees/hooks/useEmployeesScreen"
import { useCreateEmployee } from "@/features/employees/hooks/mutations/useCreateEmployee"
import { useUpdateEmployee } from "@/features/employees/hooks/mutations/useUpdateEmployee"
import { useDeleteEmployee } from "@/features/employees/hooks/mutations/useDeleteEmployee"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { Suspense } from "react"
import type { Employee, CreateEmployeeInput } from "@/features/employees/types"

export function EmployeeListClient() {
   const {
      query,
      params,
      totalPages,
      setSearch,
      setDepartment,
      setStatus,
      setPage,
      resetFilters,
      hasActiveFilters,
   } = useEmployeesScreen()

   const createMutation = useCreateEmployee()
   const updateMutation = useUpdateEmployee("")
   const deleteMutation = useDeleteEmployee()

   const [showForm, setShowForm] = useState(false)
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
   const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

   const handleCreate = async (data: CreateEmployeeInput) => {
      try {
         await createMutation.mutateAsync(data)
         toast.success("Employee created successfully")
         setShowForm(false)
      } catch (err: unknown) {
         toast.error((err as Error).message ?? "Failed to create employee")
      }
   }

   const handleUpdate = async (data: CreateEmployeeInput) => {
      if (!editingEmployee) return
      try {
         await updateMutation.mutateAsync(data)
         toast.success("Employee updated successfully")
         setEditingEmployee(null)
      } catch (err: unknown) {
         toast.error((err as Error).message ?? "Failed to update employee")
      }
   }

   const handleDelete = async () => {
      if (!deletingEmployee) return
      try {
         await deleteMutation.mutateAsync(deletingEmployee.id)
         toast.success("Employee deleted successfully")
         setDeletingEmployee(null)
      } catch (err: unknown) {
         toast.error((err as Error).message ?? "Failed to delete employee")
      }
   }

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <EmployeeFilters
               search={params.search ?? ""}
               department={params.department ?? ""}
               status={params.status ?? ""}
               onSearchChange={setSearch}
               onDepartmentChange={setDepartment}
               onStatusChange={setStatus}
               onReset={resetFilters}
               hasActiveFilters={hasActiveFilters}
            />
            <Button onClick={() => setShowForm(true)}>
               <Plus className="mr-2 size-4" />
               Add Employee
            </Button>
         </div>

         <Suspense fallback={<EmployeeTableSkeleton />}>
            {query.data && query.data.items.length > 0 ? (
               <>
                  <EmployeeTable
                     employees={query.data.items}
                     onEdit={emp => setEditingEmployee(emp)}
                     onDelete={emp => setDeletingEmployee(emp)}
                  />
                  <EmployeePagination
                     page={params.page}
                     totalPages={totalPages}
                     total={query.data.total}
                     onPageChange={setPage}
                  />
               </>
            ) : (
               <EmployeeEmptyState hasFilters={hasActiveFilters} />
            )}
         </Suspense>

         {(showForm || editingEmployee) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
               <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-4">
                     {editingEmployee ? "Edit Employee" : "Add Employee"}
                  </h2>
                  <EmployeeForm
                     employee={editingEmployee}
                     onSubmit={editingEmployee ? handleUpdate : handleCreate}
                     onCancel={() => {
                        setShowForm(false)
                        setEditingEmployee(null)
                     }}
                     isSubmitting={createMutation.isPending || updateMutation.isPending}
                  />
               </div>
            </div>
         )}

         {deletingEmployee && (
            <DeleteEmployeeDialog
               employee={deletingEmployee}
               onConfirm={handleDelete}
               onCancel={() => setDeletingEmployee(null)}
               isPending={deleteMutation.isPending}
            />
         )}
      </div>
   )
}
