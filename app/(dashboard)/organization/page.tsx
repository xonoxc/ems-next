import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { OrganizationService } from "@/features/organization/server/service"
import { orgTreeQueryOptions } from "@/features/organization/api/query-options"
import { OrganizationClient } from "@/features/organization/components/OrganizationClient"

export const dynamic = "force-dynamic"

export default async function OrganizationPage() {
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery({
      ...orgTreeQueryOptions(),
      queryFn: async () => {
         const result = await OrganizationService.getOrgTree()
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
               <h1 className="text-2xl font-bold">Organization</h1>
               <p className="text-muted-foreground">
                  View your organization&apos;s reporting structure
               </p>
            </div>
            <OrganizationClient />
         </div>
      </HydrationBoundary>
   )
}
