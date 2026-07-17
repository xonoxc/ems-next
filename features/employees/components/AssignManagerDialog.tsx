"use client"

import { useState } from "react"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
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
      <Dialog open onOpenChange={open => !open && onCancel()}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Assign Manager</DialogTitle>
               <DialogDescription>
                  Select a manager for {employee.firstName} {employee.lastName}
               </DialogDescription>
            </DialogHeader>

            <div className="max-h-60 space-y-1 overflow-y-auto scrollbar-thin">
               <Button
                  variant="ghost"
                  onClick={() => setSelectedManagerId("")}
                  className={`w-full justify-start ${!selectedManagerId ? "bg-muted" : ""}`}
               >
                  None (No Manager)
               </Button>
               {filteredManagers.map(m => (
                  <Button
                     key={m.id}
                     variant="ghost"
                     onClick={() => setSelectedManagerId(m.id)}
                     className={`w-full justify-start gap-3 ${selectedManagerId === m.id ? "bg-muted" : ""}`}
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
                  </Button>
               ))}
            </div>

            <DialogFooter>
               <Button variant="outline" onClick={onCancel}>
                  Cancel
               </Button>
               <Button
                  onClick={() => onAssign(selectedManagerId)}
                  disabled={isPending || selectedManagerId === currentManagerId}
               >
                  {isPending ? "Assigning..." : "Assign"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
