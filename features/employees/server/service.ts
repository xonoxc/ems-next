import { EmployeeRepository } from "./repository"
import { auditLogs } from "@/server/db/schema"
import { db } from "@/lib/db"
import { attempt } from "@/lib/errors"
import { err } from "neverthrow"
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

function createAuditLog(
   actorId: string,
   action: string,
   entityId: string,
   metadata?: Record<string, unknown>
) {
   return attempt(
      db.insert(auditLogs).values({
         actorId,
         action,
         entityType: "employee",
         entityId,
         metadata: metadata ?? {},
      })
   )
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

      const result = await EmployeeRepository.create(data)
      if (result.isOk()) {
         await createAuditLog(actorId, "created", result.value.id)
      }
      return result.mapErr(e => ({ status: e.status, message: e.message }) as ServiceError)
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

      const result = await EmployeeRepository.update(id, data)
      if (result.isOk()) {
         const changedFields = Object.keys(data)
         await createAuditLog(actorId, "updated", id, { fields: changedFields })
      }
      return result.mapErr(e => ({ status: e.status, message: e.message }) as ServiceError)
   },

   async softDelete(id: string, actorId: string): Promise<Result<Employee, ServiceError>> {
      const existing = await EmployeeRepository.findById(id)
      if (existing.isErr()) {
         return err(svcErr("Employee not found", 404))
      }

      const result = await EmployeeRepository.softDelete(id)
      if (result.isOk()) {
         await createAuditLog(actorId, "deleted", id)
      }
      return result.mapErr(e => ({ status: e.status, message: e.message }) as ServiceError)
   },

   async assignManager(
      employeeId: string,
      managerId: string,
      actorId: string
   ): Promise<Result<Employee, ServiceError>> {
      if (employeeId === managerId) {
         return err(svcErr("An employee cannot be their own manager"))
      }

      const employee = await EmployeeRepository.findById(employeeId)
      if (employee.isErr()) {
         return err(svcErr("Employee not found", 404))
      }

      const manager = await EmployeeRepository.findById(managerId)
      if (manager.isErr()) {
         return err(svcErr("Manager not found", 404))
      }

      const result = await EmployeeRepository.assignManager(employeeId, managerId)
      if (result.isOk()) {
         await createAuditLog(actorId, "manager_changed", employeeId, {
            previousManagerId: employee.value.managerId,
            newManagerId: managerId,
         })
      }
      return result.mapErr(e => ({ status: e.status, message: e.message }) as ServiceError)
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
