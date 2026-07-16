import { Button } from "@/components/ui/button"
import type { Employee } from "@/features/employees/types"

interface DeleteEmployeeDialogProps {
   employee: Employee
   onConfirm: () => void
   onCancel: () => void
   isPending: boolean
}

export function DeleteEmployeeDialog({
   employee,
   onConfirm,
   onCancel,
   isPending,
}: DeleteEmployeeDialogProps) {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Delete Employee</h2>
            <p className="mt-2 text-sm text-muted-foreground">
               Are you sure you want to delete{" "}
               <strong>
                  {employee.firstName} {employee.lastName}
               </strong>
               ? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
               <Button variant="outline" onClick={onCancel}>
                  Cancel
               </Button>
               <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
                  {isPending ? "Deleting..." : "Delete"}
               </Button>
            </div>
         </div>
      </div>
   )
}
