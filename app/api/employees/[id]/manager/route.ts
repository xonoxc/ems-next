import { EmployeeService } from "@/features/employees/server/service"
import { requireSession } from "@/lib/auth"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const { id } = await params
         const body = await request.json()
         const managerId = body.managerId

         if (!managerId || typeof managerId !== "string") {
            return Response.json({ error: "managerId is required" }, { status: 400 })
         }

         const result = await EmployeeService.assignManager(id, managerId, session.user.id)
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
