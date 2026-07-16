import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Building2, UserPlus } from "lucide-react"

interface StatsCardsProps {
   totalEmployees: number
   activeEmployees: number
   departmentCount: number
   recentHires: number
}

export function StatsCards({
   totalEmployees,
   activeEmployees,
   departmentCount,
   recentHires,
}: StatsCardsProps) {
   const cards = [
      { title: "Total Employees", value: totalEmployees, icon: Users },
      { title: "Active Employees", value: activeEmployees, icon: UserCheck },
      { title: "Departments", value: departmentCount, icon: Building2 },
      { title: "Recent Hires (30d)", value: recentHires, icon: UserPlus },
   ]

   return (
      <div className="grid grid-cols-4 gap-4">
         {cards.map(card => {
            const Icon = card.icon
            return (
               <Card key={card.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                     <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.title}
                     </CardTitle>
                     <Icon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <p className="text-2xl font-bold">{card.value}</p>
                  </CardContent>
               </Card>
            )
         })}
      </div>
   )
}
