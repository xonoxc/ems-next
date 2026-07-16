export type Role = "super_admin" | "hr_manager" | "employee"

export type FieldName =
   | "name"
   | "email"
   | "phone"
   | "department"
   | "designation"
   | "salary"
   | "status"
   | "managerId"
   | "role"

export type Permission = "read" | "write"

interface FieldPermission {
   read: Role[]
   write: Role[]
}

export const FIELD_PERMISSIONS: Record<FieldName, FieldPermission> = {
   name: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager"],
   },
   email: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager"],
   },
   phone: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager", "employee"],
   },
   department: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager"],
   },
   designation: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager"],
   },
   salary: {
      read: ["super_admin", "hr_manager"],
      write: ["super_admin", "hr_manager"],
   },
   status: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager"],
   },
   managerId: {
      read: ["super_admin", "hr_manager", "employee"],
      write: ["super_admin", "hr_manager"],
   },
   role: {
      read: ["super_admin", "hr_manager"],
      write: ["super_admin"],
   },
}

export const ROLE_LABELS: Record<Role, string> = {
   super_admin: "Super Admin",
   hr_manager: "HR Manager",
   employee: "Employee",
}
