"use client"

import { EmployeeTable } from "@/features/employees/components/EmployeeTable"
import { EmployeeFilters } from "@/features/employees/components/EmployeeFilters"
import { EmployeePagination } from "@/features/employees/components/EmployeePagination"
import { EmployeeForm } from "@/features/employees/components/EmployeeForm"
import { DeleteEmployeeDialog } from "@/features/employees/components/DeleteEmployeeDialog"
import { EmployeeEmptyState } from "@/features/employees/components/EmployeeEmptyState"
import { EmployeeTableSkeleton } from "@/features/employees/components/EmployeeSkeleton"
import { useEmployeesScreen } from "@/features/employees/hooks/useEmployeesScreen"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function EmployeeListClient() {
   const {
      query,
      params,
      search,
      totalPages,
      isLoading,
      isFetching,
      setSearch,
      setDepartment,
      setStatus,
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
      isSubmitting,
   } = useEmployeesScreen()

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <EmployeeFilters
               search={search}
               department={params.department ?? ""}
               status={params.status ?? ""}
               onSearchChange={setSearch}
               onDepartmentChange={setDepartment}
               onStatusChange={setStatus}
               onReset={resetFilters}
               hasActiveFilters={hasActiveFilters}
               isFetching={isFetching}
            />
            <Button onClick={() => setShowForm(true)}>
               <Plus className="mr-2 size-4" />
               Add Employee
            </Button>
         </div>

         {isLoading ? (
            <EmployeeTableSkeleton />
         ) : query.data && query.data.items.length > 0 ? (
            <div>
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
            </div>
         ) : (
            <EmployeeEmptyState hasFilters={hasActiveFilters} />
         )}

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
                     isSubmitting={isSubmitting}
                  />
               </div>
            </div>
         )}

         {deletingEmployee && (
            <DeleteEmployeeDialog
               employee={deletingEmployee}
               onConfirm={handleDelete}
               onCancel={() => setDeletingEmployee(null)}
               isPending={false}
            />
         )}
      </div>
   )
}
