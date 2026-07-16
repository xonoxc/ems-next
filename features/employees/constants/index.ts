export const DEPARTMENTS = [
   "Engineering",
   "Marketing",
   "Sales",
   "Finance",
   "HR",
   "Operations",
] as const

export const STATUSES = ["active", "inactive", "terminated"] as const

export const DESIGNATIONS = [
   "Software Engineer",
   "Senior Software Engineer",
   "Tech Lead",
   "Engineering Manager",
   "Director of Engineering",
   "VP of Engineering",
   "Marketing Coordinator",
   "Marketing Specialist",
   "Marketing Manager",
   "Director of Marketing",
   "VP of Marketing",
   "Sales Representative",
   "Senior Sales Rep",
   "Sales Manager",
   "Director of Sales",
   "VP of Sales",
   "Financial Analyst",
   "Senior Financial Analyst",
   "Finance Manager",
   "Director of Finance",
   "CFO",
   "HR Coordinator",
   "HR Specialist",
   "HR Manager",
   "Director of HR",
   "Operations Coordinator",
   "Operations Specialist",
   "Operations Manager",
   "Director of Operations",
   "VP of Operations",
   "CEO",
] as const

export const SORT_FIELDS = [
   "firstName",
   "lastName",
   "email",
   "department",
   "designation",
   "salary",
   "joiningDate",
   "status",
   "createdAt",
] as const

export type Department = (typeof DEPARTMENTS)[number]
export type EmployeeStatus = (typeof STATUSES)[number]
export type SortField = (typeof SORT_FIELDS)[number]
