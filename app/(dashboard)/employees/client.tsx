"use client"

import { useState } from "react"
import { EmployeeTable } from "@/features/employees/components/EmployeeTable"
import { EmployeeFilters } from "@/features/employees/components/EmployeeFilters"
import { EmployeePagination } from "@/features/employees/components/EmployeePagination"
import { EmployeeForm } from "@/features/employees/components/EmployeeForm"
import { DeleteEmployeeDialog } from "@/features/employees/components/DeleteEmployeeDialog"
import { EmployeeEmptyState } from "@/features/employees/components/EmployeeEmptyState"
import { EmployeeTableSkeleton } from "@/features/employees/components/EmployeeSkeleton"
import { CsvImportDialog } from "@/features/employees/components/CsvImportDialog"
import { useEmployeesScreen } from "@/features/employees/hooks/useEmployeesScreen"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

export function EmployeeListClient() {
   const [showImport, setShowImport] = useState(false)
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
      setRole,
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
      isSubmitting,
   } = useEmployeesScreen()

   const handleSort = (field: string) => {
      if (params.sortBy === field) {
         setSortOrder(params.sortOrder === "asc" ? "desc" : "asc")
      } else {
         setSortBy(field)
         setSortOrder("asc")
      }
   }

   return (
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <EmployeeFilters
               search={search}
               department={params.department ?? ""}
               status={params.status ?? ""}
               role={params.role ?? ""}
               onSearchChange={setSearch}
               onDepartmentChange={setDepartment}
               onStatusChange={setStatus}
               onRoleChange={setRole}
               onReset={resetFilters}
               hasActiveFilters={hasActiveFilters}
               isFetching={isFetching}
            />
            <div className="flex gap-2">
               <Button variant="outline" onClick={() => setShowImport(true)}>
                  <Upload className="mr-2 size-4" />
                  Import CSV
               </Button>
               <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 size-4" />
                  Add Employee
               </Button>
            </div>
         </div>

         {isLoading ? (
            <EmployeeTableSkeleton />
         ) : query.data && query.data.items.length > 0 ? (
            <div>
               <EmployeeTable
                  employees={query.data.items}
                  sortBy={params.sortBy ?? "createdAt"}
                  sortOrder={params.sortOrder ?? "desc"}
                  onSort={handleSort}
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

         {showImport && <CsvImportDialog onClose={() => setShowImport(false)} />}
      </div>
   )
}
