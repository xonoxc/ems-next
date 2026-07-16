import { Search, X } from "lucide-react"
import { DEPARTMENTS, STATUSES } from "@/features/employees/constants"

interface EmployeeFiltersProps {
   search: string
   department: string
   status: string
   onSearchChange: (value: string) => void
   onDepartmentChange: (value: string) => void
   onStatusChange: (value: string) => void
   onReset: () => void
   hasActiveFilters: boolean
}

export function EmployeeFilters({
   search,
   department,
   status,
   onSearchChange,
   onDepartmentChange,
   onStatusChange,
   onReset,
   hasActiveFilters,
}: EmployeeFiltersProps) {
   return (
      <div className="flex flex-wrap items-center gap-3">
         <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
               type="text"
               placeholder="Search employees..."
               value={search}
               onChange={e => onSearchChange(e.target.value)}
               className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
         </div>

         <select
            value={department}
            onChange={e => onDepartmentChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
         >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(dept => (
               <option key={dept} value={dept}>
                  {dept}
               </option>
            ))}
         </select>

         <select
            value={status}
            onChange={e => onStatusChange(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
         >
            <option value="">All Statuses</option>
            {STATUSES.map(s => (
               <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
               </option>
            ))}
         </select>

         {hasActiveFilters && (
            <button
               onClick={onReset}
               className="flex items-center gap-1 rounded-lg border border-input px-3 py-2 text-sm hover:bg-muted"
            >
               <X className="size-4" />
               Reset
            </button>
         )}
      </div>
   )
}
