import { describe, it, expect } from "vitest"
import {
   CreateEmployeeSchema,
   UpdateEmployeeSchema,
   EmployeeQuerySchema,
   AssignManagerSchema,
} from "@/features/employees/schemas"

describe("CreateEmployeeSchema", () => {
   const validEmployee = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      department: "Engineering",
      designation: "Software Engineer",
      salary: 80000,
      joiningDate: new Date("2024-01-15"),
      status: "active" as const,
   }

   it("accepts valid input", () => {
      const result = CreateEmployeeSchema.safeParse(validEmployee)
      expect(result.success).toBe(true)
   })

   it("rejects missing firstName", () => {
      const result = CreateEmployeeSchema.safeParse({ ...validEmployee, firstName: "" })
      expect(result.success).toBe(false)
   })

   it("rejects invalid email", () => {
      const result = CreateEmployeeSchema.safeParse({ ...validEmployee, email: "not-an-email" })
      expect(result.success).toBe(false)
   })

   it("rejects negative salary", () => {
      const result = CreateEmployeeSchema.safeParse({ ...validEmployee, salary: -100 })
      expect(result.success).toBe(false)
   })

   it("accepts optional fields", () => {
      const result = CreateEmployeeSchema.safeParse({
         ...validEmployee,
         phone: "+1234567890",
         managerId: "550e8400-e29b-41d4-a716-446655440000",
      })
      expect(result.success).toBe(true)
   })
})

describe("UpdateEmployeeSchema", () => {
   it("accepts partial data", () => {
      const result = UpdateEmployeeSchema.safeParse({ firstName: "Jane" })
      expect(result.success).toBe(true)
   })

   it("accepts empty object", () => {
      const result = UpdateEmployeeSchema.safeParse({})
      expect(result.success).toBe(true)
   })
})

describe("EmployeeQuerySchema", () => {
   it("applies defaults", () => {
      const result = EmployeeQuerySchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
         expect(result.data.page).toBe(1)
         expect(result.data.pageSize).toBe(10)
         expect(result.data.sortOrder).toBe("desc")
      }
   })

   it("validates page as positive integer", () => {
      const result = EmployeeQuerySchema.safeParse({ page: -1 })
      expect(result.success).toBe(false)
   })

   it("validates sortOrder enum", () => {
      const result = EmployeeQuerySchema.safeParse({ sortOrder: "invalid" })
      expect(result.success).toBe(false)
   })
})

describe("AssignManagerSchema", () => {
   it("accepts valid UUIDs", () => {
      const result = AssignManagerSchema.safeParse({
         employeeId: "550e8400-e29b-41d4-a716-446655440000",
         managerId: "550e8400-e29b-41d4-a716-446655440001",
      })
      expect(result.success).toBe(true)
   })

   it("rejects invalid UUID", () => {
      const result = AssignManagerSchema.safeParse({
         employeeId: "not-a-uuid",
         managerId: "550e8400-e29b-41d4-a716-446655440001",
      })
      expect(result.success).toBe(false)
   })
})
