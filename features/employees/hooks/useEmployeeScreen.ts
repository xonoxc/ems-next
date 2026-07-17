"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEmployee } from "./queries/useEmployees"
import { useUpdateEmployee } from "./mutations/useUpdateEmployee"
import { useDeleteEmployee } from "./mutations/useDeleteEmployee"
import { attempt } from "@/lib/errors"
import { toast } from "sonner"
import type { CreateEmployeeInput } from "@/features/employees/types"

export function useEmployeeScreen(id: string) {
   const router = useRouter()
   const result = useEmployee(id)

   const [editing, setEditing] = useState(false)
   const [deleting, setDeleting] = useState(false)

   const updateMutation = useUpdateEmployee()
   const deleteMutation = useDeleteEmployee()

   const handleUpdate = async (data: CreateEmployeeInput) => {
      const result = await attempt(updateMutation.mutateAsync({ id, data }))
      result.match(
         () => {
            toast.success("Employee updated")
            setEditing(false)
         },
         err => {
            const message =
               typeof err === "object" && err !== null && "message" in err
                  ? String((err as { message: unknown }).message)
                  : "Failed to update"
            toast.error(message)
         }
      )
   }

   const handleDelete = async () => {
      const result = await attempt(deleteMutation.mutateAsync(id))
      result.match(
         () => {
            toast.success("Employee deleted")
            router.push("/employees")
         },
         err => {
            const message =
               typeof err === "object" && err !== null && "message" in err
                  ? String((err as { message: unknown }).message)
                  : "Failed to delete"
            toast.error(message)
         }
      )
   }

   return {
      query: result,
      employee: result.data,
      editing,
      setEditing,
      deleting,
      setDeleting,
      handleUpdate,
      handleDelete,
      isSubmitting: updateMutation.isPending,
   }
}
