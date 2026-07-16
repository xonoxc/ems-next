import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeDetailClient } from "./client"
import { EmployeeApiClient } from "@/features/employees/api/api-client"

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery({
      queryKey: ["employees", id],
      queryFn: () => EmployeeApiClient.findById(id),
   })

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <EmployeeDetailClient id={id} />
         </div>
      </HydrationBoundary>
   )
}
