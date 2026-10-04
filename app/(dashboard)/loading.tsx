import { ChartCard } from "@/components/dashboard/chart-card"
import { PageHeader } from "@/components/layout/page-header"
import { DataSkeleton } from "@/components/feedback/data-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader title="Dashboard" description="Loading metrics…" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue" description="Loading">
          <DataSkeleton rows={5} />
        </ChartCard>
        <ChartCard title="Orders" description="Loading">
          <DataSkeleton rows={5} />
        </ChartCard>
      </div>
    </div>
  )
}
