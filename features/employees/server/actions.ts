"use server"

import { EmployeeService } from "@/features/employees/server/service"
import { OrganizationService } from "@/features/organization/server/service"
import {
   CreateEmployeeSchema,
   UpdateEmployeeSchema,
   AssignManagerSchema,
} from "@/features/employees/schemas"
import { requireSession, getUserRole } from "@/lib/auth"
import { canWriteField, requireRole } from "@/server/auth/authorization"
import { FIELD_PERMISSIONS, type FieldName } from "@/features/auth/constants/roles"
import { rateLimit } from "@/lib/rate-limit"

class ActionException extends Error {
   status: number
   constructor(message: string, status: number) {
      super(message)
      this.status = status
   }
}

function svcErr(message: string, status = 400): ActionException {
   return new ActionException(message, status)
}

export async function createEmployee(data: unknown) {
   const sessionResult = await requireSession()
   if (sessionResult.isErr()) throw svcErr(sessionResult.error.message, sessionResult.error.status)

   const session = sessionResult.value
   const role = getUserRole(session)
   const roleResult = requireRole(["super_admin", "hr_manager"])(role)
   if (roleResult.isErr()) throw svcErr(roleResult.error.message, roleResult.error.status)

   const rl = rateLimit(`create:${session.user.id}`, 10, 60_000)
   if (!rl.allowed) {
      throw svcErr(`Rate limit exceeded. Try again in ${rl.retryAfter}s`, 429)
   }

   const parsed = CreateEmployeeSchema.safeParse(data)
   if (!parsed.success) {
      throw svcErr("Invalid input")
   }

   const result = await EmployeeService.create(parsed.data, session.user.id)
   if (result.isErr()) throw svcErr(result.error.message, result.error.status)

   return result.value
}

export async function updateEmployee(id: string, data: unknown) {
   const sessionResult = await requireSession()
   if (sessionResult.isErr()) throw svcErr(sessionResult.error.message, sessionResult.error.status)

   const session = sessionResult.value
   const role = getUserRole(session)

   const rl = rateLimit(`update:${session.user.id}`, 20, 60_000)
   if (!rl.allowed) {
      throw svcErr(`Rate limit exceeded. Try again in ${rl.retryAfter}s`, 429)
   }

   const parsed = UpdateEmployeeSchema.safeParse(data)
   if (!parsed.success) {
      throw svcErr("Invalid input")
   }

   if (Object.keys(parsed.data).length === 0) {
      throw svcErr("No fields to update")
   }

   const existing = await EmployeeService.findById(id)
   if (existing.isErr()) {
      throw svcErr(existing.error.message, existing.error.status)
   }

   const isSelf = existing.value.userId === session.user.id

   for (const field of Object.keys(parsed.data)) {
      if (field in FIELD_PERMISSIONS && !canWriteField(role, field as FieldName, isSelf)) {
         throw svcErr(`Insufficient permissions to update ${field}`, 403)
      }
   }

   const result = await EmployeeService.update(id, parsed.data, session.user.id)
   if (result.isErr()) throw svcErr(result.error.message, result.error.status)

   return result.value
}

export async function deleteEmployee(id: string) {
   const sessionResult = await requireSession()
   if (sessionResult.isErr()) throw svcErr(sessionResult.error.message, sessionResult.error.status)

   const session = sessionResult.value
   const role = getUserRole(session)
   const roleResult = requireRole(["super_admin", "hr_manager"])(role)
   if (roleResult.isErr()) throw svcErr(roleResult.error.message, roleResult.error.status)

   const rl = rateLimit(`delete:${session.user.id}`, 10, 60_000)
   if (!rl.allowed) {
      throw svcErr(`Rate limit exceeded. Try again in ${rl.retryAfter}s`, 429)
   }

   const result = await EmployeeService.softDelete(id, session.user.id)
   if (result.isErr()) throw svcErr(result.error.message, result.error.status)

   return result.value
}

export async function assignManager(employeeId: string, managerId: string) {
   const sessionResult = await requireSession()
   if (sessionResult.isErr()) throw svcErr(sessionResult.error.message, sessionResult.error.status)

   const session = sessionResult.value
   const role = getUserRole(session)
   const roleResult = requireRole(["super_admin", "hr_manager"])(role)
   if (roleResult.isErr()) throw svcErr(roleResult.error.message, roleResult.error.status)

   const rl = rateLimit(`assign:${session.user.id}`, 10, 60_000)
   if (!rl.allowed) {
      throw svcErr(`Rate limit exceeded. Try again in ${rl.retryAfter}s`, 429)
   }

   const parsed = AssignManagerSchema.safeParse({ employeeId, managerId })
   if (!parsed.success) {
      throw svcErr("Invalid input")
   }

   const result = await OrganizationService.assignManager(
      parsed.data.employeeId,
      parsed.data.managerId,
      session.user.id
   )
   if (result.isErr()) throw svcErr(result.error.message, result.error.status)

   return result.value
}
