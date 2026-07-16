import {
   DashboardRepository,
   type DashboardStats,
   type DepartmentDistribution,
   type RecentActivity,
} from "./repository"
import { type Result, ok, err } from "neverthrow"

export type ServiceError = { status: number; message: string }

export const DashboardService = {
   async getSummary(): Promise<
      Result<
         {
            stats: DashboardStats
            departmentDistribution: DepartmentDistribution[]
            recentActivity: RecentActivity[]
         },
         ServiceError
      >
   > {
      const statsResult = await DashboardRepository.getStats()
      if (statsResult.isErr()) {
         return err({ status: statsResult.error.status, message: statsResult.error.message })
      }

      const deptDistResult = await DashboardRepository.getDepartmentDistribution()
      if (deptDistResult.isErr()) {
         return err({ status: deptDistResult.error.status, message: deptDistResult.error.message })
      }

      const activityResult = await DashboardRepository.getRecentActivity()
      if (activityResult.isErr()) {
         return err({ status: activityResult.error.status, message: activityResult.error.message })
      }

      return ok({
         stats: statsResult.value,
         departmentDistribution: deptDistResult.value,
         recentActivity: activityResult.value,
      })
   },
}
