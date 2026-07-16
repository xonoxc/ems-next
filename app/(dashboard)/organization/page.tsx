import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { OrganizationApiClient } from "@/features/organization/api/api-client"
import { OrganizationClient } from "@/features/organization/components/OrganizationClient"

export default async function OrganizationPage() {
   const queryClient = new QueryClient()

   await queryClient.prefetchQuery({
      queryKey: ["organization", "tree"],
      queryFn: () => OrganizationApiClient.getOrgTree(),
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
