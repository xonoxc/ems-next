import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeListClient } from "./client"
import { EmployeeApiClient } from "@/features/employees/api/api-client"

export default async function EmployeesPage() {
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery({
      queryKey: ["employees", { page: 1, pageSize: 10, sortBy: "createdAt", sortOrder: "desc" }],
      queryFn: () =>
         EmployeeApiClient.findMany({
            page: 1,
            pageSize: 10,
            sortBy: "createdAt",
            sortOrder: "desc",
         }),
   })

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
