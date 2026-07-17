import { Search, X, Loader2 } from "lucide-react"
import { DEPARTMENTS, STATUSES } from "@/features/employees/constants"
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select"

interface EmployeeFiltersProps {
   search: string
   department: string
   status: string
   onSearchChange: (value: string) => void
   onDepartmentChange: (value: string) => void
   onStatusChange: (value: string) => void
   onReset: () => void
   hasActiveFilters: boolean
   isFetching?: boolean
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
   isFetching,
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
               className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {isFetching && search && (
               <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
         </div>

         <Select value={department} onValueChange={v => onDepartmentChange(v ?? "")}>
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
               {DEPARTMENTS.map(dept => (
                  <SelectItem key={dept} value={dept}>
                     {dept}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>

         <Select value={status} onValueChange={v => onStatusChange(v ?? "")}>
            <SelectTrigger className="w-[180px]">
               <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
               {STATUSES.map(s => (
                  <SelectItem key={s} value={s}>
                     {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>

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
