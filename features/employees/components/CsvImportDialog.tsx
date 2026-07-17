"use client"

import { useState, useCallback, useRef } from "react"
import Papa from "papaparse"
import { CreateEmployeeSchema } from "@/features/employees/schemas"
import { useImportEmployees } from "@/features/employees/hooks/mutations/useImportEmployees"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface CsvRow {
   [key: string]: string
}

interface ParsedRow {
   index: number
   data: CsvRow
   errors: string[]
}

export function CsvImportDialog({ onClose }: { onClose: () => void }) {
   const [file, setFile] = useState<File | null>(null)
   const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
   const [isDragging, setIsDragging] = useState(false)
   const fileInputRef = useRef<HTMLInputElement>(null)
   const importMutation = useImportEmployees()

   const validateRow = (row: CsvRow): string[] => {
      const errors: string[] = []
      const result = CreateEmployeeSchema.safeParse({
         firstName: row.firstName,
         lastName: row.lastName,
         email: row.email,
         phone: row.phone || undefined,
         department: row.department,
         designation: row.designation,
         salary: row.salary ? Number(row.salary) : undefined,
         joiningDate: row.joiningDate ? new Date(row.joiningDate) : undefined,
         status: row.status || "active",
      })
      if (!result.success) {
         for (const issue of result.error.issues) {
            errors.push(issue.message)
         }
      }
      return errors
   }

   const handleFile = useCallback((selectedFile: File) => {
      setFile(selectedFile)
      Papa.parse(selectedFile, {
         header: true,
         skipEmptyLines: true,
         complete: results => {
            const rows = (results.data as CsvRow[]).map((row, i) => ({
               index: i,
               data: row,
               errors: validateRow(row),
            }))
            setParsedRows(rows)
         },
      })
   }, [])

   const handleDrop = useCallback(
      (e: React.DragEvent) => {
         e.preventDefault()
         setIsDragging(false)
         const droppedFile = e.dataTransfer.files[0]
         if (droppedFile && droppedFile.name.endsWith(".csv")) {
            handleFile(droppedFile)
         }
      },
      [handleFile]
   )

   const handleImport = async () => {
      const validRows = parsedRows.filter(r => r.errors.length === 0)
      if (validRows.length === 0) return

      const data = validRows.map(r => ({
         firstName: r.data.firstName,
         lastName: r.data.lastName,
         email: r.data.email,
         phone: r.data.phone || undefined,
         department: r.data.department,
         designation: r.data.designation,
         salary: r.data.salary ? Number(r.data.salary) : undefined,
         joiningDate: r.data.joiningDate ? new Date(r.data.joiningDate) : undefined,
         status: r.data.status || "active",
      }))

      const result = await importMutation.mutateAsync(data)
      toast.success(`Imported ${result.success} employees`)
      if (result.errors.length > 0) {
         toast.error(`${result.errors.length} rows failed to import`)
      }
      onClose()
   }

   const validCount = parsedRows.filter(r => r.errors.length === 0).length
   const errorCount = parsedRows.filter(r => r.errors.length > 0).length

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-semibold">Import Employees from CSV</h2>
               <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="size-4" />
               </Button>
            </div>

            {!file ? (
               <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                     isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragOver={e => {
                     e.preventDefault()
                     setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
               >
                  <Upload className="size-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                     Drag and drop a CSV file here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                     Expected columns: firstName, lastName, email, phone, department, designation,
                     salary, joiningDate, status
                  </p>
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept=".csv"
                     className="hidden"
                     onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handleFile(f)
                     }}
                  />
               </div>
            ) : (
               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                     <FileText className="size-4" />
                     <span className="text-sm flex-1">{file.name}</span>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                           setFile(null)
                           setParsedRows([])
                        }}
                     >
                        Remove
                     </Button>
                  </div>

                  <div className="flex gap-4 text-sm">
                     <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="size-4" /> {validCount} valid
                     </span>
                     {errorCount > 0 && (
                        <span className="flex items-center gap-1 text-destructive">
                           <AlertCircle className="size-4" /> {errorCount} errors
                        </span>
                     )}
                  </div>

                  <div className="border rounded-md max-h-64 overflow-auto">
                     <table className="w-full text-sm">
                        <thead className="bg-muted sticky top-0">
                           <tr>
                              <th className="p-2 text-left">#</th>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Email</th>
                              <th className="p-2 text-left">Department</th>
                              <th className="p-2 text-left">Status</th>
                           </tr>
                        </thead>
                        <tbody>
                           {parsedRows.slice(0, 50).map(row => (
                              <tr
                                 key={row.index}
                                 className={row.errors.length > 0 ? "bg-destructive/5" : ""}
                              >
                                 <td className="p-2">{row.index + 1}</td>
                                 <td className="p-2">
                                    {row.data.firstName} {row.data.lastName}
                                 </td>
                                 <td className="p-2">{row.data.email}</td>
                                 <td className="p-2">{row.data.department}</td>
                                 <td className="p-2">{row.data.status || "active"}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     {parsedRows.length > 50 && (
                        <p className="p-2 text-xs text-muted-foreground text-center">
                           Showing 50 of {parsedRows.length} rows
                        </p>
                     )}
                  </div>

                  <div className="flex justify-end gap-3">
                     <Button variant="outline" onClick={onClose}>
                        Cancel
                     </Button>
                     <Button
                        onClick={handleImport}
                        disabled={validCount === 0 || importMutation.isPending}
                     >
                        {importMutation.isPending
                           ? "Importing..."
                           : `Import ${validCount} Employees`}
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}
