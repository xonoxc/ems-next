import { Users } from "lucide-react"

interface EmployeeEmptyStateProps {
   hasFilters?: boolean
}

export function EmployeeEmptyState({ hasFilters }: EmployeeEmptyStateProps) {
   return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
         <div className="rounded-full bg-muted p-4">
            <Users className="size-8 text-muted-foreground" />
         </div>
         <h3 className="text-lg font-semibold">
            {hasFilters ? "No employees match your filters" : "No employees yet"}
         </h3>
         <p className="text-sm text-muted-foreground max-w-sm">
            {hasFilters
               ? "Try adjusting your search or filter criteria."
               : "Get started by adding your first employee to the system."}
         </p>
      </div>
   )
}
