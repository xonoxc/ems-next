"use client"

import { useEmployeeScreen } from "@/features/employees/hooks/useEmployeeScreen"
import { EmployeeDetail } from "@/features/employees/components/EmployeeDetail"
import { EmployeeForm } from "@/features/employees/components/EmployeeForm"
import { EmployeeDetailSkeleton } from "@/features/employees/components/EmployeeSkeleton"
import { DeleteEmployeeDialog } from "@/features/employees/components/DeleteEmployeeDialog"
import { useState } from "react"

export function EmployeeDetailClient({ id }: { id: string }) {
   const {
      query,
      editing,
      setEditing,
      deleting,
      setDeleting,
      handleUpdate,
      handleDelete,
      isSubmitting,
   } = useEmployeeScreen(id)
   const [managerName, setManagerName] = useState<string | undefined>(undefined)

   if (!query.data) return <EmployeeDetailSkeleton />

   const employee = query.data

   return (
      <div>
         <EmployeeDetail
            employee={employee}
            managerName={managerName}
            onEdit={() => setEditing(true)}
            onDelete={() => setDeleting(true)}
            onAssignManager={() => setManagerName(undefined)}
         />

         {editing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
               <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-4">Edit Employee</h2>
                  <EmployeeForm
                     employee={employee}
                     onSubmit={handleUpdate}
                     onCancel={() => setEditing(false)}
                     isSubmitting={isSubmitting}
                  />
               </div>
            </div>
         )}

         {deleting && (
            <DeleteEmployeeDialog
               employee={employee}
               onConfirm={handleDelete}
               onCancel={() => setDeleting(false)}
               isPending={false}
            />
         )}
      </div>
   )
}
