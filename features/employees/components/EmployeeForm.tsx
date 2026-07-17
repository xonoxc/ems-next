"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DEPARTMENTS, STATUSES } from "@/features/employees/constants"
import { Button } from "@/components/ui/button"
import type { Employee } from "@/features/employees/types"
import type { CreateEmployeeInput } from "@/features/employees/types"
import { useEffect } from "react"

const EmployeeFormSchema = z.object({
   firstName: z.string().min(1, "First name is required"),
   lastName: z.string().min(1, "Last name is required"),
   email: z.string().email("Valid email is required"),
   phone: z.string().optional(),
   department: z.string().min(1, "Department is required"),
   designation: z.string().min(1, "Designation is required"),
   salary: z.string().min(1, "Salary is required"),
   joiningDate: z.string().min(1, "Joining date is required"),
   status: z.string().min(1, "Status is required"),
   managerId: z.string().uuid("Must be a valid employee ID").optional().or(z.literal("")),
   profileImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type EmployeeFormValues = z.input<typeof EmployeeFormSchema>

interface EmployeeFormProps {
   employee?: Employee | null
   onSubmit: (data: CreateEmployeeInput) => Promise<void>
   onCancel: () => void
   isSubmitting: boolean
}

export function EmployeeForm({ employee, onSubmit, onCancel, isSubmitting }: EmployeeFormProps) {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<EmployeeFormValues>({
      resolver: zodResolver(EmployeeFormSchema),
      defaultValues: {
         firstName: employee?.firstName ?? "",
         lastName: employee?.lastName ?? "",
         email: employee?.email ?? "",
         phone: employee?.phone ?? "",
         department: (employee?.department as EmployeeFormValues["department"]) ?? "Engineering",
         designation: employee?.designation ?? "",
         salary: employee ? String(employee.salary) : "",
         joiningDate: employee?.joiningDate
            ? new Date(employee.joiningDate).toISOString().split("T")[0]
            : "",
         status: (employee?.status as EmployeeFormValues["status"]) ?? "active",
         managerId: employee?.managerId ?? undefined,
      },
   })

   useEffect(() => {
      if (employee) {
         reset({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone ?? "",
            department: employee.department as EmployeeFormValues["department"],
            designation: employee.designation,
            salary: String(employee.salary),
            joiningDate: new Date(employee.joiningDate).toISOString().split("T")[0],
            status: employee.status as EmployeeFormValues["status"],
            managerId: employee.managerId ?? undefined,
         })
      }
   }, [employee, reset])

   const handleSubmitForm = async (data: EmployeeFormValues) => {
      await onSubmit({
         ...data,
         salary: Number(data.salary),
         joiningDate: new Date(data.joiningDate),
      } as unknown as CreateEmployeeInput)
   }

   return (
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-sm font-medium">First Name</label>
               <input
                  {...register("firstName")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               />
               {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName.message}</p>
               )}
            </div>
            <div className="space-y-1">
               <label className="text-sm font-medium">Last Name</label>
               <input
                  {...register("lastName")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               />
               {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName.message}</p>
               )}
            </div>
         </div>

         <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
               type="email"
               {...register("email")}
               className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-sm font-medium">Phone</label>
               <input
                  {...register("phone")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               />
            </div>
            <div className="space-y-1">
               <label className="text-sm font-medium">Department</label>
               <select
                  {...register("department")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               >
                  {DEPARTMENTS.map(dept => (
                     <option key={dept} value={dept}>
                        {dept}
                     </option>
                  ))}
               </select>
               {errors.department && (
                  <p className="text-xs text-destructive">{errors.department.message}</p>
               )}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-sm font-medium">Designation</label>
               <input
                  {...register("designation")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               />
               {errors.designation && (
                  <p className="text-xs text-destructive">{errors.designation.message}</p>
               )}
            </div>
            <div className="space-y-1">
               <label className="text-sm font-medium">Salary</label>
               <input
                  type="number"
                  step="0.01"
                  {...register("salary")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               />
               {errors.salary && (
                  <p className="text-xs text-destructive">{errors.salary.message}</p>
               )}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-sm font-medium">Joining Date</label>
               <input
                  type="date"
                  {...register("joiningDate")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               />
               {errors.joiningDate && (
                  <p className="text-xs text-destructive">{errors.joiningDate.message}</p>
               )}
            </div>
            <div className="space-y-1">
               <label className="text-sm font-medium">Status</label>
               <select
                  {...register("status")}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
               >
                  {STATUSES.map(s => (
                     <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
               Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? "Saving..." : employee ? "Update Employee" : "Create Employee"}
            </Button>
         </div>
      </form>
   )
}
