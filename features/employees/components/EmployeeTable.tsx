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
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { employeeQueryOptions } from "@/features/employees/api/query-options"
import { EmployeeAvatar } from "./EmployeeAvatar"
import type { Employee } from "@/features/employees/types"

interface EmployeeTableProps {
   employees: Employee[]
   onEdit: (employee: Employee) => void
   onDelete: (employee: Employee) => void
}

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
   active: "default",
   inactive: "secondary",
   terminated: "destructive",
}

export function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
   const queryClient = useQueryClient()

   if (employees.length === 0) return null

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Employee</TableHead>
               <TableHead>ID</TableHead>
               <TableHead>Department</TableHead>
               <TableHead>Status</TableHead>
               <TableHead className="text-right">Salary</TableHead>
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
