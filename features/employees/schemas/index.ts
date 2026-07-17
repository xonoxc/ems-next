import { z } from "zod"
import { DEPARTMENTS, STATUSES, ROLES } from "@/features/employees/constants"

export const CreateEmployeeSchema = z.object({
   firstName: z.string({ error: "First name is required" }).min(1).max(100),
   lastName: z.string({ error: "Last name is required" }).min(1).max(100),
   email: z.email({ error: "Valid email is required" }),
   phone: z.string().max(20).optional(),
   department: z.enum(DEPARTMENTS, { error: "Department is required" }),
   designation: z.string({ error: "Designation is required" }).min(1).max(100),
   salary: z.coerce.number({ error: "Salary is required" }).positive(),
   joiningDate: z.coerce.date({ error: "Joining date is required" }),
   status: z.enum(STATUSES).default("active"),
   managerId: z.uuid().optional(),
   profileImage: z.string().optional(),
})

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()

export const EmployeeQuerySchema = z.object({
   page: z.coerce.number().int().positive().default(1),
   pageSize: z.coerce.number().int().positive().max(100).default(10),
   search: z.string().optional(),
   department: z.enum(DEPARTMENTS).optional(),
   status: z.enum(STATUSES).optional(),
   role: z.enum(ROLES).optional(),
   sortBy: z.string().default("createdAt"),
   sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const AssignManagerSchema = z.object({
   employeeId: z.uuid({ error: "Invalid employee ID" }),
   managerId: z.uuid({ error: "Invalid manager ID" }),
})

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>
export type EmployeeQueryParams = z.infer<typeof EmployeeQuerySchema>
