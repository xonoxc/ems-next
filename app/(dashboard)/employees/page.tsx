import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeService } from "@/features/employees/server/service"
import { employeesQueryOptions } from "@/features/employees/api/query-options"
import { EmployeeListClient } from "./client"
import { searchParamsCache } from "@/features/employees/search-params"
import type { SearchParams } from "nuqs/server"
import type { Department, EmployeeStatus, EmployeeRole } from "@/features/employees/constants"

export default async function EmployeesPage({
   searchParams,
}: {
   searchParams: Promise<SearchParams>
}) {
   const params = await searchParamsCache.parse(searchParams)

   const queryParams = {
      ...params,
      search: params.search || undefined,
      department: (params.department || undefined) as Department | undefined,
      status: (params.status || undefined) as EmployeeStatus | undefined,
      role: (params.role || undefined) as EmployeeRole | undefined,
   }

   const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: 30_000 } },
   })

   await queryClient.prefetchQuery({
      ...employeesQueryOptions(queryParams),
      queryFn: async () => {
         const result = await EmployeeService.findMany(queryParams)
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
