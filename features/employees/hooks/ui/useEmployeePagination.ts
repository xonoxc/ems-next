"use client"

import { useState } from "react"

export function useEmployeePagination() {
   const [page, setPage] = useState(1)
   const [pageSize] = useState(10)

   const goToPage = (newPage: number) => {
      setPage(newPage)
   }

   const goToNextPage = () => {
      setPage(p => p + 1)
   }

   const goToPrevPage = () => {
      setPage(p => Math.max(1, p - 1))
   }

   return {
      page,
      pageSize,
      goToPage,
      goToNextPage,
      goToPrevPage,
   }
}
