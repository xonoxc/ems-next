import { OrganizationService } from "@/features/organization/server/service"
import { requireSession } from "@/lib/auth"

export async function GET() {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async () => {
         const result = await OrganizationService.getOrgTree()
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
