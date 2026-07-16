import { db } from "@/lib/db"
import { employees } from "@/server/db/schema"
import { attempt } from "@/lib/errors"
import { ok, err, Result } from "neverthrow"
import { and, asc, count, desc, eq, ilike, isNull, or } from "drizzle-orm"
import type {
   CreateEmployeeInput,
   UpdateEmployeeInput,
   EmployeeQueryParams,
   Employee,
   PaginatedEmployees,
   EmployeeStats,
} from "@/features/employees/types"

export type RepositoryError = { status: number; message: string }

function repoErr(message: string, status = 500): RepositoryError {
   return { status, message }
}

export const EmployeeRepository = {
   async findById(id: string): Promise<Result<Employee, RepositoryError>> {
      const result = await attempt(
         db.query.employees.findFirst({
            where: and(eq(employees.id, id), isNull(employees.deletedAt)),
         })
      )
      return result.match(
         emp => (emp ? ok(emp) : err(repoErr("Employee not found", 404))),
         () => err(repoErr("Database error"))
      )
   },

   async findByEmail(email: string): Promise<Result<Employee, RepositoryError>> {
      const result = await attempt(
         db.query.employees.findFirst({
            where: and(eq(employees.email, email), isNull(employees.deletedAt)),
         })
      )
      return result.match(
         emp => (emp ? ok(emp) : err(repoErr("Employee not found", 404))),
         () => err(repoErr("Database error"))
      )
   },

   async findMany(
      params: EmployeeQueryParams
   ): Promise<Result<PaginatedEmployees, RepositoryError>> {
      const { page, pageSize, search, department, status: empStatus, sortBy, sortOrder } = params
      const conditions = [isNull(employees.deletedAt)]

      if (search) {
         conditions.push(
            or(
               ilike(employees.firstName, `%${search}%`),
               ilike(employees.lastName, `%${search}%`),
               ilike(employees.email, `%${search}%`),
               ilike(employees.employeeId, `%${search}%`)
            )!
         )
      }

      if (department) {
         conditions.push(eq(employees.department, department))
      }

      if (empStatus) {
         conditions.push(eq(employees.status, empStatus))
      }

      const where = and(...conditions)
      const offset = (page - 1) * pageSize
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortColumn = (employees as Record<string, any>)[sortBy] ?? employees.createdAt
      const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn)

      const itemsResult = await attempt(
         db.query.employees.findMany({ where, orderBy, limit: pageSize, offset })
      )
      const totalResult = await attempt(
         db
            .select({ value: count() })
            .from(employees)
            .where(where)
            .then(r => r[0]?.value ?? 0)
      )

      return Result.combine([itemsResult, totalResult])
         .mapErr(() => repoErr("Database error"))
         .map(([itemList, total]) => ({
            items: itemList,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
         }))
   },

   async create(data: CreateEmployeeInput): Promise<Result<Employee, RepositoryError>> {
      const employeeId = `EMP${String(Date.now()).slice(-6)}`
      const result = await attempt(
         db
            .insert(employees)
            .values({
               employeeId,
               firstName: data.firstName,
               lastName: data.lastName,
               email: data.email,
               phone: data.phone ?? null,
               department: data.department,
               designation: data.designation,
               salary: String(data.salary),
               joiningDate: new Date(data.joiningDate),
               status: data.status ?? "active",
               managerId: data.managerId ?? null,
               profileImage: data.profileImage ?? null,
            })
            .returning()
      )
      return result.match(
         ([emp]) => (emp ? ok(emp) : err(repoErr("Failed to create employee"))),
         () => err(repoErr("Database error"))
      )
   },

   async update(id: string, data: UpdateEmployeeInput): Promise<Result<Employee, RepositoryError>> {
      const values: Record<string, unknown> = {}
      if (data.firstName !== undefined) values.firstName = data.firstName
      if (data.lastName !== undefined) values.lastName = data.lastName
      if (data.email !== undefined) values.email = data.email
      if (data.phone !== undefined) values.phone = data.phone
      if (data.department !== undefined) values.department = data.department
      if (data.designation !== undefined) values.designation = data.designation
      if (data.salary !== undefined) values.salary = String(data.salary)
      if (data.joiningDate !== undefined) values.joiningDate = new Date(data.joiningDate)
      if (data.status !== undefined) values.status = data.status
      if (data.managerId !== undefined) values.managerId = data.managerId
      if (data.profileImage !== undefined) values.profileImage = data.profileImage
      values.updatedAt = new Date()

      const result = await attempt(
         db
            .update(employees)
            .set(values)
            .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
            .returning()
      )
      return result.match(
         ([emp]) => (emp ? ok(emp) : err(repoErr("Employee not found", 404))),
         () => err(repoErr("Database error"))
      )
   },

   async softDelete(id: string): Promise<Result<Employee, RepositoryError>> {
      const result = await attempt(
         db
            .update(employees)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
            .returning()
      )
      return result.match(
         ([emp]) => (emp ? ok(emp) : err(repoErr("Employee not found", 404))),
         () => err(repoErr("Database error"))
      )
   },

   async assignManager(
      employeeId: string,
      managerId: string
   ): Promise<Result<Employee, RepositoryError>> {
      const result = await attempt(
         db
            .update(employees)
            .set({ managerId, updatedAt: new Date() })
            .where(and(eq(employees.id, employeeId), isNull(employees.deletedAt)))
            .returning()
      )
      return result.match(
         ([emp]) => (emp ? ok(emp) : err(repoErr("Employee not found", 404))),
         () => err(repoErr("Database error"))
      )
   },

   async findReportees(managerId: string): Promise<Result<Employee[], RepositoryError>> {
      const result = await attempt(
         db.query.employees.findMany({
            where: and(eq(employees.managerId, managerId), isNull(employees.deletedAt)),
            orderBy: [asc(employees.firstName)],
         })
      )
      return result.match(
         emps => ok(emps),
         () => err(repoErr("Database error"))
      )
   },

   async getStats(): Promise<Result<EmployeeStats, RepositoryError>> {
      const result = await attempt(
         db
            .select({
               status: employees.status,
               department: employees.department,
               value: count(),
            })
            .from(employees)
            .where(isNull(employees.deletedAt))
            .groupBy(employees.status, employees.department)
      )
      return result
         .mapErr(() => repoErr("Database error"))
         .map(rows => {
            const stats: EmployeeStats = {
               total: 0,
               active: 0,
               inactive: 0,
               terminated: 0,
               departmentCounts: {},
            }
            for (const row of rows) {
               const n = Number(row.value)
               stats.total += n
               if (row.status === "active") stats.active += n
               else if (row.status === "inactive") stats.inactive += n
               else if (row.status === "terminated") stats.terminated += n
               stats.departmentCounts[row.department] =
                  (stats.departmentCounts[row.department] ?? 0) + n
            }
            return stats
         })
   },

   async getRecentEmployees(limit = 5): Promise<Result<Employee[], RepositoryError>> {
      const result = await attempt(
         db.query.employees.findMany({
            where: isNull(employees.deletedAt),
            orderBy: desc(employees.createdAt),
            limit,
         })
      )
      return result.match(
         emps => ok(emps),
         () => err(repoErr("Database error"))
      )
   },
}
