"use client"

import { useState, useCallback } from "react"

export function useEmployeePagination() {
   const [page, setPage] = useState(1)
   const [pageSize] = useState(10)

   const goToPage = useCallback((newPage: number) => {
      setPage(newPage)
   }, [])

   const goToNextPage = useCallback(() => {
      setPage(p => p + 1)
   }, [])

   const goToPrevPage = useCallback(() => {
      setPage(p => Math.max(1, p - 1))
   }, [])

   return { page, pageSize, goToPage, goToNextPage, goToPrevPage }
}
