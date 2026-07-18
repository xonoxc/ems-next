"use client"

import { useEmployeeScreen } from "@/features/employees/hooks/useEmployeeScreen"
import { useEmployees, useReportees } from "@/features/employees/hooks/queries/useEmployees"
import { EmployeeDetail } from "@/features/employees/components/EmployeeDetail"
import { EmployeeForm } from "@/features/employees/components/EmployeeForm"
import { EmployeeDetailSkeleton } from "@/features/employees/components/EmployeeSkeleton"
import { DeleteEmployeeDialog } from "@/features/employees/components/DeleteEmployeeDialog"
import { AssignManagerDialog } from "@/features/employees/components/AssignManagerDialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigateWithParams } from "@/hooks/use-navigate-with-params"

export function EmployeeDetailClient({ id }: { id: string }) {
   const {
      query,
      editing,
      setEditing,
      deleting,
      setDeleting,
      assigningManager,
      setAssigningManager,
      handleUpdate,
      handleDelete,
      handleAssignManager,
      isSubmitting,
      isAssigningManager,
   } = useEmployeeScreen(id)

   const { navigateTo } = useNavigateWithParams()

   const employeesQuery = useEmployees({
      page: 1,
      pageSize: 100,
      sortBy: "firstName",
      sortOrder: "asc",
   })
   const employees = employeesQuery.data?.items ?? []

   const reporteesQuery = useReportees(id)
   const reportees = reporteesQuery.data ?? []

   if (!query.data) return <EmployeeDetailSkeleton />

   const employee = query.data

   return (
      <div>
         <button type="button" onClick={() => navigateTo("/employees")}>
            <Button variant="ghost" size="sm">
               <ArrowLeft className="size-4" />
               Back to Employees
            </Button>
         </button>

         <div className="mt-4">
            <EmployeeDetail
               employee={employee}
               managerName={
                  employees.find(m => m.id === employee.managerId)
                     ? `${employees.find(m => m.id === employee.managerId)!.firstName} ${employees.find(m => m.id === employee.managerId)!.lastName}`
                     : undefined
               }
               reportees={reportees}
               onEdit={() => setEditing(true)}
               onDelete={() => setDeleting(true)}
               onAssignManager={() => setAssigningManager(true)}
            />
         </div>

         {editing && (
            <Dialog open onOpenChange={open => !open && setEditing(false)}>
               <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
                  <DialogHeader>
                     <DialogTitle>Edit Employee</DialogTitle>
                  </DialogHeader>
                  <EmployeeForm
                     employee={employee}
                     onSubmit={handleUpdate}
                     onCancel={() => setEditing(false)}
                     isSubmitting={isSubmitting}
                  />
               </DialogContent>
            </Dialog>
         )}

         {deleting && (
            <DeleteEmployeeDialog
               employee={employee}
               onConfirm={handleDelete}
               onCancel={() => setDeleting(false)}
               isPending={false}
            />
         )}

         {assigningManager && (
            <AssignManagerDialog
               employee={employee}
               managers={employees}
               currentManagerId={employee.managerId}
               onAssign={handleAssignManager}
               onCancel={() => setAssigningManager(false)}
               isPending={isAssigningManager}
            />
         )}
      </div>
   )
}
