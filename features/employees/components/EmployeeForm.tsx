"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { DEPARTMENTS, STATUSES, DESIGNATIONS } from "@/features/employees/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "./ImageUpload"
import type { Employee } from "@/features/employees/types"
import type { CreateEmployeeInput } from "@/features/employees/types"

const EmployeeFormSchema = z.object({
   firstName: z.string({ error: "First name is needed" }).min(1),
   lastName: z.string({ error: "Last name is needed" }).min(1),
   email: z.email({ error: "Enter a valid email" }),
   phone: z.string().optional(),
   department: z.string({ error: "Department is needed" }).min(1),
   designation: z.string({ error: "Designation is needed" }).min(1),
   salary: z.string({ error: "Salary is needed" }).min(1),
   joiningDate: z.string({ error: "Joining date is needed" }).min(1),
   status: z.string({ error: "Status is needed" }).min(1),
   managerId: z.uuid({ error: "Must be a valid employee ID" }).optional().or(z.literal("")),
   profileImage: z.string().optional(),
})

export type EmployeeFormValues = z.input<typeof EmployeeFormSchema>

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
      control,
      watch,
      setValue,
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
         profileImage: employee?.profileImage ?? undefined,
      },
   })

   const profileImage = watch("profileImage")

   const handleSubmitForm = async (data: EmployeeFormValues) => {
      await onSubmit({
         ...data,
         salary: Number(data.salary),
         joiningDate: new Date(data.joiningDate),
      } as unknown as CreateEmployeeInput)
   }

   return (
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
         {Object.keys(errors).length > 0 && <p className="text-sm text-destructive">Required</p>}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.firstName}>
               <FieldLabel htmlFor="firstName">First Name</FieldLabel>
               <Input id="firstName" {...register("firstName")} aria-invalid={!!errors.firstName} />
               <FieldError errors={errors.firstName ? [errors.firstName] : undefined} />
            </Field>
            <Field data-invalid={!!errors.lastName}>
               <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
               <Input id="lastName" {...register("lastName")} aria-invalid={!!errors.lastName} />
               <FieldError errors={errors.lastName ? [errors.lastName] : undefined} />
            </Field>
         </div>

         <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            <FieldError errors={errors.email ? [errors.email] : undefined} />
         </Field>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.phone}>
               <FieldLabel htmlFor="phone">Phone</FieldLabel>
               <Input id="phone" {...register("phone")} aria-invalid={!!errors.phone} />
               <FieldError errors={errors.phone ? [errors.phone] : undefined} />
            </Field>
            <Field data-invalid={!!errors.department}>
               <FieldLabel>Department</FieldLabel>
               <Controller
                  control={control}
                  name="department"
                  render={({ field, fieldState }) => (
                     <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                           <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                           {DEPARTMENTS.map(dept => (
                              <SelectItem key={dept} value={dept}>
                                 {dept}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  )}
               />
               <FieldError errors={errors.department ? [errors.department] : undefined} />
            </Field>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.designation}>
               <FieldLabel>Designation</FieldLabel>
               <Controller
                  control={control}
                  name="designation"
                  render={({ field, fieldState }) => (
                     <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                           <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                           {DESIGNATIONS.map(des => (
                              <SelectItem key={des} value={des}>
                                 {des}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  )}
               />
               <FieldError errors={errors.designation ? [errors.designation] : undefined} />
            </Field>
            <Field data-invalid={!!errors.salary}>
               <FieldLabel htmlFor="salary">Salary</FieldLabel>
               <Input
                  id="salary"
                  type="number"
                  step="0.01"
                  {...register("salary")}
                  aria-invalid={!!errors.salary}
               />
               <FieldError errors={errors.salary ? [errors.salary] : undefined} />
            </Field>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field data-invalid={!!errors.joiningDate}>
               <FieldLabel htmlFor="joiningDate">Joining Date</FieldLabel>
               <Input
                  id="joiningDate"
                  type="date"
                  {...register("joiningDate")}
                  aria-invalid={!!errors.joiningDate}
               />
               <FieldError errors={errors.joiningDate ? [errors.joiningDate] : undefined} />
            </Field>
            <Field data-invalid={!!errors.status}>
               <FieldLabel>Status</FieldLabel>
               <Controller
                  control={control}
                  name="status"
                  render={({ field, fieldState }) => (
                     <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                           <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                           {STATUSES.map(s => (
                              <SelectItem key={s} value={s}>
                                 {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  )}
               />
               <FieldError errors={errors.status ? [errors.status] : undefined} />
            </Field>
         </div>

         <Field>
            <FieldLabel>Profile Image</FieldLabel>
            <ImageUpload
               value={profileImage}
               onChange={val => setValue("profileImage", val ?? "")}
            />
         </Field>

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
