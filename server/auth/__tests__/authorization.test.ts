import { describe, it, expect } from "vitest"
import {
   hasPermission,
   filterFields,
   canWriteField,
   requireRole,
} from "@/server/auth/authorization"
import type { Role } from "@/features/auth/constants/roles"

describe("hasPermission", () => {
   it("allows super_admin to read all fields", () => {
      const fields = [
         "name",
         "email",
         "phone",
         "department",
         "designation",
         "salary",
         "status",
         "managerId",
         "role",
      ] as const
      for (const field of fields) {
         expect(hasPermission("super_admin", field, "read", false)).toBe(true)
      }
   })

   it("allows super_admin to write all fields", () => {
      const fields = [
         "name",
         "email",
         "phone",
         "department",
         "designation",
         "salary",
         "status",
         "managerId",
         "role",
      ] as const
      for (const field of fields) {
         expect(hasPermission("super_admin", field, "write", false)).toBe(true)
      }
   })

   it("denies employee from reading salary", () => {
      expect(hasPermission("employee", "salary", "read", false)).toBe(false)
   })

   it("allows employee to read own phone", () => {
      expect(hasPermission("employee", "phone", "read", true)).toBe(true)
   })

   it("allows employee to write own phone", () => {
      expect(hasPermission("employee", "phone", "write", true)).toBe(true)
   })

   it("denies employee from writing own department", () => {
      expect(hasPermission("employee", "department", "write", true)).toBe(false)
   })

   it("denies hr_manager from writing role", () => {
      expect(hasPermission("hr_manager", "role", "write", false)).toBe(false)
   })

   it("allows super_admin to write role", () => {
      expect(hasPermission("super_admin", "role", "write", false)).toBe(true)
   })
})

describe("filterFields", () => {
   it("filters salary for employee viewing another", () => {
      const data = { name: "John", salary: 50000, phone: "123" }
      const result = filterFields(data, "employee", false)
      expect(result).toEqual({ name: "John", phone: "123" })
      expect(result).not.toHaveProperty("salary")
   })

   it("keeps all fields for super_admin", () => {
      const data = { name: "John", salary: 50000, role: "employee" }
      const result = filterFields(data, "super_admin", false)
      expect(result).toEqual(data)
   })

   it("keeps phone for employee viewing self", () => {
      const data = { phone: "123", salary: 50000 }
      const result = filterFields(data, "employee", true)
      expect(result.phone).toBe("123")
      expect(result).not.toHaveProperty("salary")
   })
})

describe("canWriteField", () => {
   it("allows hr_manager to write department", () => {
      expect(canWriteField("hr_manager", "department", false)).toBe(true)
   })

   it("denies employee from writing designation", () => {
      expect(canWriteField("employee", "designation", false)).toBe(false)
   })

   it("allows employee to write own phone", () => {
      expect(canWriteField("employee", "phone", true)).toBe(true)
   })
})

describe("requireRole", () => {
   it("returns ok for allowed role", () => {
      const check = requireRole(["super_admin", "hr_manager"])
      const result = check("hr_manager" as Role)
      expect(result.isOk()).toBe(true)
   })

   it("returns err for disallowed role", () => {
      const check = requireRole(["super_admin", "hr_manager"])
      const result = check("employee" as Role)
      expect(result.isErr()).toBe(true)
      if (result.isErr()) {
         expect(result.error.status).toBe(403)
      }
   })
})
