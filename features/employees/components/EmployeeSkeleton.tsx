import { Skeleton } from "@/components/ui/skeleton"

export function EmployeeTableSkeleton() {
   return (
      <div className="space-y-3">
         <div className="flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
         </div>
         {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
         ))}
      </div>
   )
}

export function EmployeeDetailSkeleton() {
   return (
      <div className="space-y-6">
         <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="space-y-2">
               <Skeleton className="h-6 w-48" />
               <Skeleton className="h-4 w-32" />
            </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-40" />
               </div>
            ))}
         </div>
      </div>
   )
}
