import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
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
      <ConfirmDialog
         open
         title="Delete Employee"
         description={`Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`}
         confirmLabel="Delete"
         variant="destructive"
         onConfirm={onConfirm}
         onCancel={onCancel}
         isPending={isPending}
      />
   )
}
