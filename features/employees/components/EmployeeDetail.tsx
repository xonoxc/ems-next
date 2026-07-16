import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmployeeAvatar } from "./EmployeeAvatar"
import type { Employee } from "@/features/employees/types"
import { format } from "date-fns"

interface EmployeeDetailProps {
   employee: Employee
   managerName?: string
   onEdit: () => void
   onDelete: () => void
   onAssignManager: () => void
}

export function EmployeeDetail({
   employee,
   managerName,
   onEdit,
   onDelete,
   onAssignManager,
}: EmployeeDetailProps) {
   return (
      <div className="space-y-8">
         <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
               <EmployeeAvatar
                  src={employee.profileImage}
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  className="size-16 text-lg"
               />
               <div>
                  <h1 className="text-2xl font-bold">
                     {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-muted-foreground">
                     {employee.designation} &middot; {employee.department}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                     <Badge
                        variant={
                           employee.status === "active"
                              ? "default"
                              : employee.status === "inactive"
                                ? "secondary"
                                : "destructive"
                        }
                     >
                        {employee.status}
                     </Badge>
                     <span className="text-xs text-muted-foreground">
                        ID: {employee.employeeId}
                     </span>
                  </div>
               </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" onClick={onAssignManager}>
                  Change Manager
               </Button>
               <Button onClick={onEdit}>Edit</Button>
               <Button variant="destructive" onClick={onDelete}>
                  Delete
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Email</p>
               <p className="font-medium">{employee.email}</p>
            </div>
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Phone</p>
               <p className="font-medium">{employee.phone ?? "—"}</p>
            </div>
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Department</p>
               <p className="font-medium">{employee.department}</p>
            </div>
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Designation</p>
               <p className="font-medium">{employee.designation}</p>
            </div>
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Salary</p>
               <p className="font-medium">${Number(employee.salary).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Joining Date</p>
               <p className="font-medium">
                  {format(new Date(employee.joiningDate), "MMM d, yyyy")}
               </p>
            </div>
            <div className="space-y-1">
               <p className="text-sm text-muted-foreground">Manager</p>
               <p className="font-medium">{managerName ?? "—"}</p>
            </div>
         </div>
      </div>
   )
}
