import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { EmployeeDetailClient } from "./client"

export default async function EmployeePage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params
   const queryClient = new QueryClient()

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="space-y-6 p-6">
            <EmployeeDetailClient id={id} />
         </div>
      </HydrationBoundary>
   )
}
