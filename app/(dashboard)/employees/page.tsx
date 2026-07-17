import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeListClient } from "./client"
import { EmployeeService } from "@/features/employees/server/service"
import { requireSession, getUserRole } from "@/lib/auth"
import { filterFields } from "@/server/auth/authorization"

import type { Employee } from "@/features/employees/types"

export default async function EmployeesPage() {
   const queryClient = new QueryClient()

   const sessionResult = await requireSession()
   sessionResult.match(
      async session => {
         const result = await EmployeeService.findMany({
            page: 1,
            pageSize: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
         })
         result.match(
            data => {
               const role = getUserRole(session)
               const filteredItems = data.items.map(
                  emp => filterFields(emp as Record<string, unknown>, role, false) as Employee
               )
               queryClient.setQueryData(
                  ["employees", { page: 1, pageSize: 10, sortBy: "createdAt", sortOrder: "desc" }],
                  { ...data, items: filteredItems }
               )
            },
            () => {}
         )
      },
      () => {}
   )

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <div>
               <h1 className="text-2xl font-bold">Employees</h1>
               <p className="text-muted-foreground">Manage your organization&apos;s employees</p>
            </div>
            <EmployeeListClient />
         </div>
      </HydrationBoundary>
   )
}
