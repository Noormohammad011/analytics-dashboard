import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { DashboardEmpty } from "@/components/dashboard/dashboard-empty"
import { DashboardKpiGrid } from "@/components/dashboard/dashboard-kpi-grid"
import { OrdersLineChart } from "@/components/dashboard/orders-line-chart"
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table"
import { RevenueLineChart } from "@/components/dashboard/revenue-line-chart"
import { PageHeader } from "@/components/layout/page-header"
import { getDashboardData } from "@/lib/dashboard/get-dashboard-data"

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (data.recentOrders.length === 0 && data.kpis[1].value === "0") {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <PageHeader
          title="Dashboard"
          description="Overview of revenue, orders, and system health."
        />
        <DashboardEmpty />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Overview of revenue, orders, and system health."
      />

      <DashboardKpiGrid kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueLineChart points={data.revenuePoints} />
        <OrdersLineChart points={data.ordersPoints} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentOrdersTable orders={data.recentOrders} />
        <ActivityFeed activities={data.activities} />
      </div>
    </div>
  )
}
