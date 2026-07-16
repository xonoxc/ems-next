import { EmployeeService } from "@/features/employees/server/service"
import { UpdateEmployeeSchema } from "@/features/employees/schemas"
import { requireSession } from "@/lib/auth"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async () => {
         const { id } = await params
         const result = await EmployeeService.findById(id)
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const { id } = await params
         const body = await request.json()
         const parsed = UpdateEmployeeSchema.safeParse(body)
         if (!parsed.success) {
            return Response.json({ error: "Invalid input" }, { status: 400 })
         }

         const result = await EmployeeService.update(id, parsed.data, session.user.id)
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const { id } = await params
         const result = await EmployeeService.softDelete(id, session.user.id)
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
