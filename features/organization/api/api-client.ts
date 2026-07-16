export class OrganizationApiError extends Error {
   constructor(
      public status: number,
      message: string
   ) {
      super(message)
      this.name = "OrganizationApiError"
   }
}

async function handleResponse<T>(response: Response): Promise<T> {
   if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new OrganizationApiError(response.status, body.error ?? "Unknown error")
   }
   return response.json()
}

export interface OrgTreeNode {
   id: string
   firstName: string
   lastName: string
   designation: string
   department: string
   profileImage: string | null
   managerId: string | null
   children: OrgTreeNode[]
}

export const OrganizationApiClient = {
   async getOrgTree(): Promise<OrgTreeNode[]> {
      const response = await fetch("/api/organization/tree")
      return handleResponse<OrgTreeNode[]>(response)
   },
}
