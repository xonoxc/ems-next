"use client"

import { useState } from "react"

export function useEmployeeFilters() {
   const [search, setSearch] = useState("")
   const [department, setDepartment] = useState<string>("")
   const [status, setStatus] = useState<string>("")

   const resetFilters = () => {
      setSearch("")
      setDepartment("")
      setStatus("")
   }

   const hasActiveFilters = search || department || status

   return {
      search,
      setSearch,
      department,
      setDepartment,
      status,
      setStatus,
      resetFilters,
      hasActiveFilters,
   }
}
