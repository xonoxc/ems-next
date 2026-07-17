import type { Employee, PaginatedEmployees, EmployeeQueryParams } from "@/features/employees/types"
import { attempt } from "@/lib/errors"

const BASE_URL = "/api/employees"

export class EmployeeApiError extends Error {
   constructor(
      public status: number,
      message: string
   ) {
      super(message)
      this.name = "EmployeeApiError"
   }
}

async function handleResponse<T>(response: Response): Promise<T> {
   if (!response.ok) {
      const result = await attempt(response.json())
      const body = result.match(
         value => value,
         () => ({ error: "Unknown error" })
      )
      throw new EmployeeApiError(response.status, body.error ?? "Unknown error")
   }
   return response.json()
}

export const EmployeeApiClient = {
   async findMany(params: EmployeeQueryParams): Promise<PaginatedEmployees> {
      const searchParams = new URLSearchParams()
      searchParams.set("page", String(params.page))
      searchParams.set("pageSize", String(params.pageSize))
      if (params.search) searchParams.set("search", params.search)
      if (params.department) searchParams.set("department", params.department)
      if (params.status) searchParams.set("status", params.status)
      if (params.sortBy) searchParams.set("sortBy", params.sortBy)
      if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)

      const response = await fetch(`${BASE_URL}?${searchParams}`)
      return handleResponse<PaginatedEmployees>(response)
   },

   async findById(id: string): Promise<Employee> {
      const response = await fetch(`${BASE_URL}/${id}`)
      return handleResponse<Employee>(response)
   },

   async findReportees(managerId: string): Promise<Employee[]> {
      const response = await fetch(`${BASE_URL}/${managerId}/reportees`)
      return handleResponse<Employee[]>(response)
   },
}
