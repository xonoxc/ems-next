import type { InferSelectModel } from "drizzle-orm"
import type { employees } from "@/server/db/schema"
import type {
   CreateEmployeeInput,
   UpdateEmployeeInput,
   EmployeeQueryParams,
} from "@/features/employees/schemas"

export type Employee = InferSelectModel<typeof employees>

export type { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQueryParams }

export interface PaginatedEmployees {
   items: Employee[]
   total: number
   page: number
   pageSize: number
   totalPages: number
}

export interface EmployeeStats {
   total: number
   active: number
   inactive: number
   terminated: number
   departmentCounts: Record<string, number>
}
