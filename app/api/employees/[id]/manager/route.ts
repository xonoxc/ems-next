import { OrganizationService } from "@/features/organization/server/service"
import { requireSession, getUserRole } from "@/lib/auth"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const role = getUserRole(session)
         if (!["super_admin", "hr_manager"].includes(role)) {
            return Response.json({ error: "Insufficient permissions" }, { status: 403 })
         }

         const { id } = await params
         const body = await request.json()
         const managerId = body.managerId

         if (!managerId || typeof managerId !== "string") {
            return Response.json({ error: "managerId is required" }, { status: 400 })
         }

         const result = await OrganizationService.assignManager(id, managerId, session.user.id)
         return result.match(
            () => Response.json({ success: true }),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
