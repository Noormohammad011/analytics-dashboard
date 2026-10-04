import { ChartCard } from "@/components/dashboard/chart-card"
import { Badge } from "@/components/ui/badge"
import { formatRelativeTime } from "@/lib/format/relative-time"
import type { Activity } from "@/lib/types"

type ActivityFeedProps = {
  activities: Activity[]
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <ChartCard title="System activity" description="Recent events">
      <ul className="flex flex-col gap-4">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex flex-col gap-1 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{activity.type}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground">{activity.message}</p>
          </li>
        ))}
      </ul>
    </ChartCard>
  )
}
