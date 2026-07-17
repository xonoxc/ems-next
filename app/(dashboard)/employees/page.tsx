import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeListClient } from "./client"
import { employeesQueryOptions } from "@/features/employees/api/query-options"

const defaultParams = { page: 1, pageSize: 10, sortBy: "createdAt", sortOrder: "desc" as const }

export default async function EmployeesPage() {
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery(employeesQueryOptions(defaultParams))

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
