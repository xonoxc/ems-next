# API Documentation

## Authentication

All endpoints (except sign-in) require a valid session cookie.

### Sign In

```
POST /api/auth/sign-in/email
Body: { email: string, password: string }
Returns: Sets session cookie
```

### Sign Out

```
POST /api/auth/sign-out
Returns: Clears session cookie
```

### Get Session

```
GET /api/auth/get-session
Returns: { user: { id, name, email, role }, session: { ... } }
```

---

## Employees

### List Employees

```
GET /api/employees
Auth: Any authenticated user

Query Parameters:
  page        (number, default: 1)      — Page number
  pageSize    (number, default: 10)     — Items per page (max 100)
  search      (string)                  — Search across firstName, lastName, email, employeeId
  department  (string)                  — Filter by department
  status      (string)                  — Filter by status (active, inactive, terminated)
  role        (string)                  — Filter by user role (super_admin, hr_manager, employee)
  sortBy      (string, default: createdAt) — Sort field
  sortOrder   (string, default: desc)   — Sort direction (asc, desc)

Returns: {
  items: Employee[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

### Get Employee

```
GET /api/employees/:id
Auth: Any authenticated user

Returns: Employee object (fields filtered by role)
```

### Get Reportees

```
GET /api/employees/:id/reportees
Auth: Any authenticated user

Returns: Employee[]
```

### Create Employee (Server Action)

```
createEmployee(data: CreateEmployeeInput)
Auth: super_admin, hr_manager
Rate Limit: 10 per minute

Body: {
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  department: "Engineering" | "Marketing" | "Sales" | "Finance" | "HR" | "Operations",
  designation: string,
  salary: number,
  joiningDate: Date,
  status?: "active" | "inactive" | "terminated",
  managerId?: UUID,
  profileImage?: string
}

Returns: Employee
```

### Update Employee (Server Action)

```
updateEmployee(id: string, data: UpdateEmployeeInput)
Auth: Any authenticated user (field-level permissions enforced)
Rate Limit: 20 per minute

Body: Partial CreateEmployeeInput (only changed fields)

Returns: Employee
```

### Delete Employee (Server Action)

```
deleteEmployee(id: string)
Auth: super_admin, hr_manager
Rate Limit: 10 per minute

Soft-deletes the employee (sets deletedAt timestamp)
Returns: Employee
```

### Assign Manager (Server Action)

```
assignManager(employeeId: string, managerId: string)
Auth: super_admin, hr_manager
Rate Limit: 10 per minute

Validates:
  - Cannot assign self as manager
  - Manager must exist
  - Would not create circular hierarchy

Returns: void
```

### Import Employees (Server Action)

```
importEmployees(data: unknown[])
Auth: super_admin, hr_manager
Rate Limit: 50 per minute

Validates each row against CreateEmployeeSchema.
Returns: {
  success: number,
  errors: { row: number, message: string }[]
}
```

---

## Dashboard

### Get Summary

```
GET /api/dashboard/summary
Auth: Any authenticated user

Returns: {
  stats: {
    totalEmployees: number,
    activeEmployees: number,
    departmentCount: number,
    recentHires: number
  },
  departmentDistribution: { department: string, count: number }[],
  recentActivity: {
    id: string,
    action: string,
    entityType: string,
    actorName: string | null,
    createdAt: Date
  }[]
}
```

---

## Organization

### Get Org Tree

```
GET /api/organization/tree
Auth: Any authenticated user

Returns: OrgTreeNode[] (recursive tree structure)
{
  id: string,
  firstName: string,
  lastName: string,
  designation: string,
  department: string,
  profileImage: string | null,
  managerId: string | null,
  children: OrgTreeNode[]
}
```
