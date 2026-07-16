import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query"
import { OrganizationClient } from "@/features/organization/components/OrganizationClient"
import { OrganizationService } from "@/features/organization/server/service"

export default async function OrganizationPage() {
   const queryClient = new QueryClient()

   const result = await OrganizationService.getOrgTree()

   result.match(
      data => {
         queryClient.setQueryData(["organization", "tree"], data)
      },
      () => {}
   )

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
