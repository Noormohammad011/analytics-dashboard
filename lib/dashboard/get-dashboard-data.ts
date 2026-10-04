import { getActivities } from "@/lib/api/activities"
import { getAnalyticsSummary, getOrdersSeries, getRevenueSeries } from "@/lib/api/analytics"
import { getOrders } from "@/lib/api/orders"
import { formatDeltaPercent } from "@/lib/format/delta"
import { formatCents } from "@/lib/format/currency"
import { formatPercent } from "@/lib/format/percent"
import { getDashboardRanges } from "@/lib/dashboard/periods"
import type { Activity, OrderListItem, TimeSeriesPoint } from "@/lib/types"

export type DashboardKpi = {
  label: string
  value: string
  delta: string
  deltaTone: "positive" | "negative" | "neutral"
}

export type DashboardData = {
  kpis: DashboardKpi[]
  revenuePoints: TimeSeriesPoint[]
  ordersPoints: TimeSeriesPoint[]
  recentOrders: OrderListItem[]
  activities: Activity[]
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const ranges = getDashboardRanges()

  const [summary, previousSummary, revenue, ordersSeries, recent, activitiesRes] =
    await Promise.all([
      getAnalyticsSummary(ranges.current),
      getAnalyticsSummary(ranges.previous),
      getRevenueSeries(ranges.current),
      getOrdersSeries(ranges.current),
      getOrders({ page: 1, pageSize: 5 }),
      getActivities(8),
    ])

  const revenueDelta = formatDeltaPercent(
    summary.revenueCents,
    previousSummary.revenueCents,
  )
  const ordersDelta = formatDeltaPercent(
    summary.orderCount,
    previousSummary.orderCount,
  )
  const customersDelta = formatDeltaPercent(
    summary.activeCustomers,
    previousSummary.activeCustomers,
  )
  const conversionDelta = formatDeltaPercent(
    summary.conversionRate,
    previousSummary.conversionRate,
  )

  return {
    kpis: [
      {
        label: "Revenue",
        value: formatCents(summary.revenueCents),
        delta: revenueDelta.label,
        deltaTone: revenueDelta.tone,
      },
      {
        label: "Orders",
        value: String(summary.orderCount),
        delta: ordersDelta.label,
        deltaTone: ordersDelta.tone,
      },
      {
        label: "Active customers",
        value: String(summary.activeCustomers),
        delta: customersDelta.label,
        deltaTone: customersDelta.tone,
      },
      {
        label: "Conversion",
        value: formatPercent(summary.conversionRate),
        delta: conversionDelta.label,
        deltaTone: conversionDelta.tone,
      },
    ],
    revenuePoints: revenue.points,
    ordersPoints: ordersSeries.points,
    recentOrders: recent.items,
    activities: activitiesRes.items,
  }
}
