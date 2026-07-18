"use client"

import { Suspense } from "react"
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader"
import { StatsCards } from "@/features/dashboard/components/StatsCards"
import { RecentActivity } from "@/features/dashboard/components/RecentActivity"
import { DepartmentChart } from "@/features/dashboard/components/DepartmentChart"
import { useDashboardSummary } from "@/features/dashboard/hooks/queries/useDashboardSummary"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardSkeleton() {
   return (
      <div className="space-y-6">
         <Skeleton className="h-8 w-48" />
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
               <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Skeleton className="h-72 rounded-lg" />
            <Skeleton className="h-72 rounded-lg" />
         </div>
      </div>
   )
}

export function DashboardClient() {
   return (
      <div className="space-y-6">
         <DashboardHeader />
         <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
         </Suspense>
      </div>
   )
}

function DashboardContent() {
   const { data } = useDashboardSummary()

   return (
      <>
         <StatsCards
            totalEmployees={data.stats.totalEmployees}
            activeEmployees={data.stats.activeEmployees}
            departmentCount={data.stats.departmentCount}
            recentHires={data.stats.recentHires}
         />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-3">
            <DepartmentChart data={data.departmentDistribution} />
            <RecentActivity activities={data.recentActivity} />
         </div>
      </>
   )
}
