import { db } from "@/lib/db"
import { employees, auditLogs, users } from "@/server/db/schema"
import { attempt } from "@/lib/errors"
import { isNull, count, desc, sql } from "drizzle-orm"
import { type Result } from "neverthrow"

export type RepositoryError = { status: number; message: string }

export interface DashboardStats {
   totalEmployees: number
   activeEmployees: number
   departmentCount: number
   recentHires: number
}

export interface DepartmentDistribution {
   department: string
   count: number
}

export interface MonthlyHiringTrend {
   month: string
   count: number
}

export interface RecentActivity {
   id: string
   action: string
   entityType: string
   actorName: string | null
   createdAt: Date
}

export const DashboardRepository = {
   async getStats(): Promise<Result<DashboardStats, RepositoryError>> {
      const result = await attempt(
         db
            .select({
               total: count(),
               active: sql<number>`COUNT(CASE WHEN ${employees.status} = 'active' THEN 1 END)`,
               departments: sql<number>`COUNT(DISTINCT ${employees.department})`,
               recentHires: sql<number>`COUNT(CASE WHEN ${employees.joiningDate} >= NOW() - INTERVAL '30 days' THEN 1 END)`,
            })
            .from(employees)
            .where(isNull(employees.deletedAt))
            .then(rows => rows[0])
      )
      return result
         .map(row => ({
            totalEmployees: Number(row.total),
            activeEmployees: Number(row.active),
            departmentCount: Number(row.departments),
            recentHires: Number(row.recentHires),
         }))
         .mapErr(e => ({ status: 500, message: (e as Error).message }))
   },

   async getDepartmentDistribution(): Promise<Result<DepartmentDistribution[], RepositoryError>> {
      const result = await attempt(
         db
            .select({
               department: employees.department,
               count: count(),
            })
            .from(employees)
            .where(isNull(employees.deletedAt))
            .groupBy(employees.department)
            .orderBy(desc(count()))
      )
      return result.mapErr(e => ({ status: 500, message: (e as Error).message }))
   },

   async getRecentActivity(limit = 10): Promise<Result<RecentActivity[], RepositoryError>> {
      const result = await attempt(
         db
            .select({
               id: auditLogs.id,
               action: auditLogs.action,
               entityType: auditLogs.entityType,
               actorName: sql<
                  string | null
               >`(SELECT name FROM ${users} WHERE id = ${auditLogs.actorId})`,
               createdAt: auditLogs.createdAt,
            })
            .from(auditLogs)
            .orderBy(desc(auditLogs.createdAt))
            .limit(limit)
      )
      return result.mapErr(e => ({ status: 500, message: (e as Error).message }))
   },
}
