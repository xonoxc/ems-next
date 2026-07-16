import { EmployeeService } from "@/features/employees/server/service"
import { requireSession, getUserRole } from "@/lib/auth"
import { filterFields } from "@/server/auth/authorization"
import type { Employee } from "@/features/employees/types"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const { id } = await params
         const result = await EmployeeService.findById(id)
         return result.match(
            data => {
               const role = getUserRole(session)
               const isSelf = data.userId === session.user.id
               const filtered = filterFields(
                  data as Record<string, unknown>,
                  role,
                  isSelf
               ) as Employee
               return Response.json(filtered)
            },
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
