import type { AnalyticsSummary, Order, TimeSeriesPoint } from "@/lib/types"
import { getSeedData } from "@/lib/server/data"
import { isWithinRange, toDateKey } from "@/lib/server/date-range"

const REVENUE_STATUSES = new Set(["paid", "shipped"])

export const filterOrdersByRange = (orders: Order[], from: Date, to: Date) =>
  orders.filter((order) => isWithinRange(order.createdAt, from, to))

export const computeSummary = async (from: Date, to: Date): Promise<AnalyticsSummary> => {
  const { orders, customers } = await getSeedData()
  const inRange = filterOrdersByRange(orders, from, to)

  const revenueCents = inRange
    .filter((o) => REVENUE_STATUSES.has(o.status))
    .reduce((sum, o) => sum + o.amountCents, 0)

  const paid = inRange.filter((o) => o.status === "paid").length
  const pending = inRange.filter((o) => o.status === "pending").length
  const cancelled = inRange.filter((o) => o.status === "cancelled").length
  const denominator = paid + cancelled + pending
  const conversionRate = denominator === 0 ? 0 : paid / denominator

  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setUTCDate(sixtyDaysAgo.getUTCDate() - 60)
  const recentCustomerIds = new Set(
    orders
      .filter((o) => new Date(o.createdAt) >= sixtyDaysAgo)
      .map((o) => o.customerId),
  )
  const activeCustomers = customers.filter((c) => recentCustomerIds.has(c.id)).length

  return {
    revenueCents,
    orderCount: inRange.length,
    activeCustomers,
    conversionRate,
    from: from.toISOString(),
    to: to.toISOString(),
  }
}

const bucketSeries = (
  orders: Order[],
  from: Date,
  to: Date,
  valueForOrder: (order: Order) => number,
) => {
  const buckets = new Map<string, number>()
  const cursor = new Date(from)
  cursor.setUTCHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setUTCHours(0, 0, 0, 0)

  while (cursor <= end) {
    buckets.set(toDateKey(cursor.toISOString()), 0)
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  for (const order of orders) {
    if (!isWithinRange(order.createdAt, from, to)) continue
    const key = toDateKey(order.createdAt)
    if (!buckets.has(key)) continue
    buckets.set(key, (buckets.get(key) ?? 0) + valueForOrder(order))
  }

  const points: TimeSeriesPoint[] = []
  for (const [date, value] of buckets.entries()) {
    points.push({ date, value })
  }
  points.sort((a, b) => a.date.localeCompare(b.date))
  return points
}

export const computeRevenueSeries = async (from: Date, to: Date) => {
  const { orders } = await getSeedData()
  const inRange = filterOrdersByRange(orders, from, to)
  const points = bucketSeries(inRange, from, to, (order) =>
    REVENUE_STATUSES.has(order.status) ? order.amountCents : 0,
  )
  return { points }
}

export const computeOrdersSeries = async (from: Date, to: Date) => {
  const { orders } = await getSeedData()
  const inRange = filterOrdersByRange(orders, from, to)
  const points = bucketSeries(inRange, from, to, () => 1)
  return { points }
}
