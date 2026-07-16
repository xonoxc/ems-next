import { formatDistanceToNow } from "date-fns"

interface Activity {
   id: string
   action: string
   entityType: string
   actorName: string | null
   createdAt: Date
}

interface RecentActivityProps {
   activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
   return (
      <div className="space-y-4">
         <h3 className="font-semibold">Recent Activity</h3>
         <div className="space-y-3">
            {activities.map(activity => (
               <div key={activity.id} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 size-2 rounded-full bg-primary" />
                  <div className="flex-1">
                     <p>
                        <span className="font-medium">{activity.actorName ?? "Someone"}</span>{" "}
                        <span className="text-muted-foreground capitalize">
                           {activity.action.replace(/_/g, " ")}
                        </span>{" "}
                        <span className="text-muted-foreground">{activity.entityType}</span>
                     </p>
                     <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   )
}
