import { OrganizationRepository, type OrgTreeNode } from "./repository"
import { EmployeeRepository } from "@/features/employees/server/repository"
import { auditLogs } from "@/server/db/schema"
import { db } from "@/lib/db"
import { attempt } from "@/lib/errors"
import { err, ok, type Result } from "neverthrow"

export type ServiceError = { status: number; message: string }

function svcErr(message: string, status = 400): ServiceError {
   return { status, message }
}

export const OrganizationService = {
   async getOrgTree(): Promise<Result<OrgTreeNode[], ServiceError>> {
      return (await OrganizationRepository.getOrgTree()).mapErr(
         e => ({ status: e.status, message: e.message }) as ServiceError
      )
   },

   async assignManager(
      employeeId: string,
      managerId: string,
      actorId: string
   ): Promise<Result<void, ServiceError>> {
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

      const cycleCheck = await OrganizationRepository.wouldCreateCycle(employeeId, managerId)
      if (cycleCheck.isErr()) {
         return err(svcErr(cycleCheck.error.message, cycleCheck.error.status))
      }
      if (cycleCheck.value) {
         return err(svcErr("This assignment would create a circular hierarchy"))
      }

      const assignResult = await EmployeeRepository.assignManager(employeeId, managerId)
      if (assignResult.isErr()) {
         return err(svcErr(assignResult.error.message, assignResult.error.status))
      }

      await attempt(
         db.insert(auditLogs).values({
            actorId,
            action: "manager_changed",
            entityType: "employee",
            entityId: employeeId,
            metadata: {
               previousManagerId: employee.value.managerId,
               newManagerId: managerId,
            },
         })
      )

      return ok(undefined)
   },
}
