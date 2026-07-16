import { EmployeeService } from "@/features/employees/server/service"
import { UpdateEmployeeSchema } from "@/features/employees/schemas"
import { requireSession, getUserRole } from "@/lib/auth"
import { filterFields, canWriteField } from "@/server/auth/authorization"
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async session => {
         const { id } = await params
         const role = getUserRole(session)

         const body = await request.json()
         const parsed = UpdateEmployeeSchema.safeParse(body)
         if (!parsed.success) {
            return Response.json({ error: "Invalid input" }, { status: 400 })
         }

         const existing = await EmployeeService.findById(id)
         if (existing.isErr()) {
            return Response.json(
               { error: existing.error.message },
               { status: existing.error.status }
            )
         }

         const isSelf = existing.value.userId === session.user.id

         for (const field of Object.keys(parsed.data)) {
            if (!canWriteField(role, field as never, isSelf)) {
               return Response.json(
                  { error: `Insufficient permissions to update ${field}` },
                  { status: 403 }
               )
            }
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
         const role = getUserRole(session)
         if (!["super_admin", "hr_manager"].includes(role)) {
            return Response.json({ error: "Insufficient permissions" }, { status: 403 })
         }

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
