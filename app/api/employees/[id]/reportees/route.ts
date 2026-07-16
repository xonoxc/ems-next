import { EmployeeService } from "@/features/employees/server/service"
import { requireSession } from "@/lib/auth"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async () => {
         const { id } = await params
         const result = await EmployeeService.findReportees(id)
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
