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
   if (field === "phone" && permission === "write" && isSelf) {
      return true
   }

   const fieldPerm = FIELD_PERMISSIONS[field]
   if (!fieldPerm) return false

   const allowedRoles = fieldPerm[permission]
   return allowedRoles.includes(role)
}

export function filterFields<T extends Record<string, unknown>>(
   data: T,
   role: Role,
   isSelf: boolean
): T {
   const result: Record<string, unknown> = {}

   for (const key of Object.keys(data)) {
      if (key in FIELD_PERMISSIONS) {
         if (hasPermission(role, key as FieldName, "read", isSelf)) {
            result[key] = data[key]
         }
      } else {
         result[key] = data[key]
      }
   }

   return result as T
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
