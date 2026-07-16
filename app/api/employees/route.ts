import { EmployeeService } from "@/features/employees/server/service"
import { EmployeeQuerySchema, CreateEmployeeSchema } from "@/features/employees/schemas"
import { requireSession, getUserRole } from "@/lib/auth"
import { filterFields } from "@/server/auth/authorization"
import type { Employee } from "@/features/employees/types"

export async function GET(request: Request) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const url = new URL(request.url)
         const params = EmployeeQuerySchema.safeParse(Object.fromEntries(url.searchParams))
         if (!params.success) {
            return Response.json({ error: "Invalid query parameters" }, { status: 400 })
         }

         const result = await EmployeeService.findMany(params.data)
         return result.match(
            data => {
               const role = getUserRole(session)
               const filteredItems = data.items.map(
                  emp => filterFields(emp as Record<string, unknown>, role, false) as Employee
               )
               return Response.json({ ...data, items: filteredItems })
            },
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}

export async function POST(request: Request) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const role = getUserRole(session)
         if (!["super_admin", "hr_manager"].includes(role)) {
            return Response.json({ error: "Insufficient permissions" }, { status: 403 })
         }

         const body = await request.json()
         const parsed = CreateEmployeeSchema.safeParse(body)
         if (!parsed.success) {
            return Response.json({ error: "Invalid input" }, { status: 400 })
         }

         const result = await EmployeeService.create(parsed.data, session.user.id)
         return result.match(
            data => Response.json(data, { status: 201 }),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
