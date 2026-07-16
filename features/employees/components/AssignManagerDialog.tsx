"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Employee } from "@/features/employees/types"
import { EmployeeAvatar } from "./EmployeeAvatar"

interface AssignManagerDialogProps {
   employee: Employee
   managers: Employee[]
   currentManagerId: string | null
   onAssign: (managerId: string) => void
   onCancel: () => void
   isPending: boolean
}

export function AssignManagerDialog({
   employee,
   managers,
   currentManagerId,
   onAssign,
   onCancel,
   isPending,
}: AssignManagerDialogProps) {
   const [selectedManagerId, setSelectedManagerId] = useState(currentManagerId ?? "")

   const filteredManagers = managers.filter(m => m.id !== employee.id)

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Assign Manager</h2>
            <p className="mt-1 text-sm text-muted-foreground">
               Select a manager for{" "}
               <strong>
                  {employee.firstName} {employee.lastName}
               </strong>
            </p>

            <div className="mt-4 max-h-60 space-y-1 overflow-y-auto">
               <button
                  onClick={() => setSelectedManagerId("")}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-muted ${!selectedManagerId ? "bg-muted" : ""}`}
               >
                  None (No Manager)
               </button>
               {filteredManagers.map(m => (
                  <button
                     key={m.id}
                     onClick={() => setSelectedManagerId(m.id)}
                     className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted ${selectedManagerId === m.id ? "bg-muted" : ""}`}
                  >
                     <EmployeeAvatar
                        src={m.profileImage}
                        firstName={m.firstName}
                        lastName={m.lastName}
                        className="size-7"
                     />
                     <div>
                        <p className="font-medium">
                           {m.firstName} {m.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                           {m.designation} &middot; {m.department}
                        </p>
                     </div>
                  </button>
               ))}
            </div>

            <div className="mt-4 flex justify-end gap-3">
               <Button variant="outline" onClick={onCancel}>
                  Cancel
               </Button>
               <Button
                  onClick={() => onAssign(selectedManagerId)}
                  disabled={isPending || selectedManagerId === currentManagerId}
               >
                  {isPending ? "Assigning..." : "Assign"}
               </Button>
            </div>
         </div>
      </div>
   )
}
