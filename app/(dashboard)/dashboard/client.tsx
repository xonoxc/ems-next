"use client"

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader"
import { StatsCards } from "@/features/dashboard/components/StatsCards"
import { RecentActivity } from "@/features/dashboard/components/RecentActivity"
import { DepartmentChart } from "@/features/dashboard/components/DepartmentChart"
import { useDashboardSummary } from "@/features/dashboard/hooks/queries/useDashboardSummary"

export function DashboardClient() {
   return (
      <div className="space-y-6">
         <DashboardHeader />
         <DashboardContent />
      </div>
   )
}

function DashboardContent() {
   const { data, isPending } = useDashboardSummary()

   return (
      <div className={isPending ? "opacity-60 pointer-events-none" : ""}>
         <StatsCards
            totalEmployees={data.stats.totalEmployees}
            activeEmployees={data.stats.activeEmployees}
            departmentCount={data.stats.departmentCount}
            recentHires={data.stats.recentHires}
         />
         <div className="grid grid-cols-2 gap-6 mt-3">
            <DepartmentChart data={data.departmentDistribution} />
            <RecentActivity activities={data.recentActivity} />
         </div>
      </div>
   )
}
