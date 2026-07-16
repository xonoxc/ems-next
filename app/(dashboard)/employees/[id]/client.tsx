"use client"

import { useState, useCallback } from "react"
import { useEmployeeScreen } from "@/features/employees/hooks/useEmployeeScreen"
import { EmployeeDetail } from "@/features/employees/components/EmployeeDetail"
import { EmployeeForm } from "@/features/employees/components/EmployeeForm"
import { EmployeeDetailSkeleton } from "@/features/employees/components/EmployeeSkeleton"
import { DeleteEmployeeDialog } from "@/features/employees/components/DeleteEmployeeDialog"
import { useUpdateEmployee } from "@/features/employees/hooks/mutations/useUpdateEmployee"
import { useDeleteEmployee } from "@/features/employees/hooks/mutations/useDeleteEmployee"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { CreateEmployeeInput } from "@/features/employees/types"

export function EmployeeDetailClient({ id }: { id: string }) {
   const router = useRouter()
   const { query } = useEmployeeScreen(id)
   const updateMutation = useUpdateEmployee(id)
   const deleteMutation = useDeleteEmployee()
   const [editing, setEditing] = useState(false)
   const [deleting, setDeleting] = useState(false)
   const [managerName, setManagerName] = useState<string | undefined>(undefined)

   const handleUpdate = useCallback(
      async (data: CreateEmployeeInput) => {
         try {
            await updateMutation.mutateAsync(data)
            toast.success("Employee updated")
            setEditing(false)
         } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update")
         }
      },
      [updateMutation]
   )

   const handleDelete = useCallback(async () => {
      try {
         await deleteMutation.mutateAsync(id)
         toast.success("Employee deleted")
         router.push("/employees")
      } catch (err) {
         toast.error(err instanceof Error ? err.message : "Failed to delete")
      }
   }, [deleteMutation, id, router])

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
                     isSubmitting={updateMutation.isPending}
                  />
               </div>
            </div>
         )}

         {deleting && (
            <DeleteEmployeeDialog
               employee={employee}
               onConfirm={handleDelete}
               onCancel={() => setDeleting(false)}
               isPending={deleteMutation.isPending}
            />
         )}
      </div>
   )
}
