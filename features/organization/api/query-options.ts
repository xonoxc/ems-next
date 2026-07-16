import { queryOptions } from "@tanstack/react-query"
import { OrganizationApiClient } from "./api-client"

export function orgTreeQueryOptions() {
   return queryOptions({
      queryKey: ["organization", "tree"],
      queryFn: () => OrganizationApiClient.getOrgTree(),
   })
}
