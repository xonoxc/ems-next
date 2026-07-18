import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeService } from "@/features/employees/server/service"
import { employeesQueryOptions } from "@/features/employees/api/query-options"
import { EmployeeListClient } from "./client"

const DEFAULT_PARAMS = {
   page: 1,
   pageSize: 10,
   sortBy: "createdAt",
   sortOrder: "desc" as const,
   search: undefined,
   department: undefined,
   status: undefined,
   role: undefined,
}

export default async function EmployeesPage() {
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery({
      ...employeesQueryOptions(DEFAULT_PARAMS),
      queryFn: async () => {
         const result = await EmployeeService.findMany(DEFAULT_PARAMS)
         if (result.isErr()) {
            throw new Error(result.error.message)
         }
         return result.value
      },
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
