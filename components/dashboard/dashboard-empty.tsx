import { EmptyState } from "@/components/feedback/empty-state"

export const DashboardEmpty = () => (
  <EmptyState
    title="No dashboard data"
    description="Seed files look empty. Run pnpm seed:generate and refresh."
  />
)
