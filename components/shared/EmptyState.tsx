import { Inbox } from "lucide-react"

interface EmptyStateProps {
   title: string
   description?: string
   icon?: React.ReactNode
   action?: React.ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
   return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card p-12 text-center">
         {icon ?? <Inbox className="size-12 text-muted-foreground" />}
         <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
         </div>
         {action}
      </div>
   )
}
