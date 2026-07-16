import { EmployeeService } from "@/features/employees/server/service"
import { EmployeeQuerySchema, CreateEmployeeSchema } from "@/features/employees/schemas"
import { requireSession } from "@/lib/auth"

export async function GET(request: Request) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async () => {
         const url = new URL(request.url)
         const params = EmployeeQuerySchema.safeParse(Object.fromEntries(url.searchParams))
         if (!params.success) {
            return Response.json({ error: "Invalid query parameters" }, { status: 400 })
         }

         const result = await EmployeeService.findMany(params.data)
         return result.match(
            data => Response.json(data),
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
