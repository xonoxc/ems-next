import { DashboardService } from "@/features/dashboard/server/service"
import { requireSession } from "@/lib/auth"

export async function GET() {
   const sessionResult = await requireSession()
   return sessionResult.match(
      async () => {
         const result = await DashboardService.getSummary()
         return result.match(
            data => Response.json(data),
            error => Response.json({ error: error.message }, { status: error.status })
         )
      },
      error => Response.json({ error: error.message }, { status: error.status })
   )
}
