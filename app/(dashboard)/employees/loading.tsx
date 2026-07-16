import { EmployeeTableSkeleton } from "@/features/employees/components/EmployeeSkeleton"

export default function EmployeesLoading() {
   return (
      <div className="space-y-6 p-6">
         <div>
            <h1 className="text-2xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your organization&apos;s employees</p>
         </div>
         <EmployeeTableSkeleton />
      </div>
   )
}
