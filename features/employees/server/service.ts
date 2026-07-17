import { EmployeeRepository } from "./repository"
import { employees, auditLogs } from "@/server/db/schema"
import { db } from "@/lib/db"
import { attempt } from "@/lib/errors"
import { err, ok } from "neverthrow"
import { and, eq, isNull } from "drizzle-orm"
import { type Result } from "neverthrow"
import type {
   CreateEmployeeInput,
   UpdateEmployeeInput,
   EmployeeQueryParams,
   Employee,
   PaginatedEmployees,
   EmployeeStats,
} from "@/features/employees/types"

export type ServiceError = { status: number; message: string }

function svcErr(message: string, status = 400): ServiceError {
   return { status, message }
}

export const EmployeeService = {
   async findById(id: string): Promise<Result<Employee, ServiceError>> {
      return (await EmployeeRepository.findById(id)).mapErr(
         e => ({ status: e.status, message: e.message }) as ServiceError
      )
   },

   async findMany(params: EmployeeQueryParams): Promise<Result<PaginatedEmployees, ServiceError>> {
      return (await EmployeeRepository.findMany(params)).mapErr(
         e => ({ status: e.status, message: e.message }) as ServiceError
      )
   },

   async create(
      data: CreateEmployeeInput,
      actorId: string
   ): Promise<Result<Employee, ServiceError>> {
      const existing = await EmployeeRepository.findByEmail(data.email)
      if (existing.isOk()) {
         return err(svcErr("An employee with this email already exists"))
      }

      if (data.managerId) {
         const manager = await EmployeeRepository.findById(data.managerId)
         if (manager.isErr()) {
            return err(svcErr("Manager not found", 404))
         }
      }

      const txResult = await attempt(
         db.transaction(async tx => {
            const employeeId = `EMP${String(Date.now()).slice(-6)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`
            const [emp] = await tx
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

            if (!emp) throw new Error("Failed to create employee")

            await tx.insert(auditLogs).values({
               actorId,
               action: "created",
               entityType: "employee",
               entityId: emp.id,
               metadata: {},
            })

            return emp
         })
      )

      if (txResult.isErr()) {
         const error = txResult.error
         if (error instanceof Error && error.message === "Failed to create employee") {
            return err(svcErr(error.message))
         }
         return err(svcErr("Database error"))
      }

      return ok(txResult.value)
   },

   async update(
      id: string,
      data: UpdateEmployeeInput,
      actorId: string
   ): Promise<Result<Employee, ServiceError>> {
      const existing = await EmployeeRepository.findById(id)
      if (existing.isErr()) {
         return err(svcErr("Employee not found", 404))
      }

      if (data.email && data.email !== existing.value.email) {
         const emailCheck = await EmployeeRepository.findByEmail(data.email)
         if (emailCheck.isOk()) {
            return err(svcErr("An employee with this email already exists"))
         }
      }

      if (data.managerId) {
         if (data.managerId === id) {
            return err(svcErr("An employee cannot be their own manager"))
         }
         const manager = await EmployeeRepository.findById(data.managerId)
         if (manager.isErr()) {
            return err(svcErr("Manager not found", 404))
         }
      }

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

      const changedFields = Object.keys(data)

      const txResult = await attempt(
         db.transaction(async tx => {
            const [emp] = await tx
               .update(employees)
               .set(values)
               .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
               .returning()

            if (!emp) throw new Error("Employee not found")

            await tx.insert(auditLogs).values({
               actorId,
               action: "updated",
               entityType: "employee",
               entityId: id,
               metadata: { fields: changedFields },
            })

            return emp
         })
      )

      if (txResult.isErr()) {
         const error = txResult.error
         if (error instanceof Error && error.message === "Employee not found") {
            return err(svcErr(error.message, 404))
         }
         return err(svcErr("Database error"))
      }

      return ok(txResult.value)
   },

   async softDelete(id: string, actorId: string): Promise<Result<Employee, ServiceError>> {
      const existing = await EmployeeRepository.findById(id)
      if (existing.isErr()) {
         return err(svcErr("Employee not found", 404))
      }

      const txResult = await attempt(
         db.transaction(async tx => {
            const [emp] = await tx
               .update(employees)
               .set({ deletedAt: new Date(), updatedAt: new Date() })
               .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
               .returning()

            if (!emp) throw new Error("Employee not found")

            await tx.insert(auditLogs).values({
               actorId,
               action: "deleted",
               entityType: "employee",
               entityId: id,
               metadata: {},
            })

            return emp
         })
      )

      if (txResult.isErr()) {
         const error = txResult.error
         if (error instanceof Error && error.message === "Employee not found") {
            return err(svcErr(error.message, 404))
         }
         return err(svcErr("Database error"))
      }

      return ok(txResult.value)
   },

   async findReportees(managerId: string): Promise<Result<Employee[], ServiceError>> {
      return (await EmployeeRepository.findReportees(managerId)).mapErr(
         e => ({ status: e.status, message: e.message }) as ServiceError
      )
   },

   async getStats(): Promise<Result<EmployeeStats, ServiceError>> {
      return (await EmployeeRepository.getStats()).mapErr(
         e => ({ status: e.status, message: e.message }) as ServiceError
      )
   },
}
