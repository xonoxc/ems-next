import { FIELD_PERMISSIONS, type FieldName, type Permission } from "@/features/auth/constants/roles"
import { ok, err, type Result } from "neverthrow"

export type Role = "super_admin" | "hr_manager" | "employee"

type ServiceError = { status: number; message: string }

export function hasPermission(
   role: Role,
   field: FieldName,
   permission: Permission,
   isSelf: boolean
): boolean {
   const fieldPerm = FIELD_PERMISSIONS[field]
   if (!fieldPerm) return false

   const allowedRoles = fieldPerm[permission]
   if (!allowedRoles.includes(role)) return false

   if (field === "phone" && permission === "write" && isSelf) {
      return true
   }

   return allowedRoles.includes(role)
}

export function filterFields<T extends Record<string, unknown>>(
   data: T,
   role: Role,
   isSelf: boolean
): Partial<T> {
   const result: Record<string, unknown> = {}

   for (const field of Object.keys(FIELD_PERMISSIONS) as FieldName[]) {
      if (field in data && hasPermission(role, field, "read", isSelf)) {
         result[field] = data[field]
      }
   }

   return result as Partial<T>
}

export function canWriteField(role: Role, field: FieldName, isSelf: boolean): boolean {
   return hasPermission(role, field, "write", isSelf)
}

export function requireRole(allowedRoles: Role[]) {
   return (userRole: string): Result<void, ServiceError> => {
      if (!allowedRoles.includes(userRole as Role)) {
         return err({ status: 403, message: "Insufficient permissions" })
      }
      return ok(undefined)
   }
}

export function getFieldPermissionsForRole(role: Role) {
   return Object.entries(FIELD_PERMISSIONS).reduce(
      (acc, [field, perms]) => {
         acc[field as FieldName] = {
            canRead: perms.read.includes(role),
            canWrite: perms.write.includes(role),
         }
         return acc
      },
      {} as Record<FieldName, { canRead: boolean; canWrite: boolean }>
   )
}
