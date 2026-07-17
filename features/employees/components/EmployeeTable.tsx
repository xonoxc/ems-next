"use client"

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { employeeQueryOptions } from "@/features/employees/api/query-options"
import { EmployeeAvatar } from "./EmployeeAvatar"
import { format } from "date-fns"
import type { Employee } from "@/features/employees/types"

interface EmployeeTableProps {
   employees: Employee[]
   sortBy: string
   sortOrder: "asc" | "desc"
   onSort: (field: string) => void
   onEdit: (employee: Employee) => void
   onDelete: (employee: Employee) => void
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
   active: "default",
   inactive: "secondary",
   terminated: "destructive",
}

const sortableColumns = [
   { key: "firstName", label: "Employee" },
   { key: "employeeId", label: "ID" },
   { key: "department", label: "Department" },
   { key: "status", label: "Status" },
   { key: "salary", label: "Salary", align: "right" as const },
   { key: "joiningDate", label: "Joined" },
] as const

export function EmployeeTable({
   employees,
   sortBy,
   sortOrder,
   onSort,
   onEdit,
   onDelete,
}: EmployeeTableProps) {
   const queryClient = useQueryClient()

   if (employees.length === 0) return null

   return (
      <Table>
         <TableHeader>
            <TableRow>
               {sortableColumns.map(col => (
                  <TableHead key={col.key} className={col.align === "right" ? "text-right" : ""}>
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1 px-2 font-medium"
                        onClick={() => onSort(col.key)}
                     >
                        {col.label}
                        {sortBy === col.key ? (
                           sortOrder === "asc" ? (
                              <ArrowUp className="size-3.5" />
                           ) : (
                              <ArrowDown className="size-3.5" />
                           )
                        ) : (
                           <ArrowUpDown className="size-3.5 opacity-50" />
                        )}
                     </Button>
                  </TableHead>
               ))}
               <TableHead className="text-right">Actions</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {employees.map(employee => (
               <TableRow key={employee.id}>
                  <TableCell>
                     <Link
                        href={`/employees/${employee.id}`}
                        className="flex items-center gap-3"
                        onMouseEnter={() =>
                           queryClient.prefetchQuery({
                              ...employeeQueryOptions(employee.id),
                              staleTime: 60_000,
                           })
                        }
                     >
                        <EmployeeAvatar
                           src={employee.profileImage}
                           firstName={employee.firstName}
                           lastName={employee.lastName}
                           className="size-8"
                        />
                        <div>
                           <p className="font-medium">
                              {employee.firstName} {employee.lastName}
                           </p>
                           <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                     </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                     <Badge variant={statusBadgeVariant[employee.status]}>{employee.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                     ${Number(employee.salary).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                     {format(new Date(employee.joiningDate), "MMM yyyy")}
                  </TableCell>
                  <TableCell>
                     <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
                           <Edit className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(employee)}>
                           <Trash2 className="size-4" />
                        </Button>
                     </div>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   )
}
