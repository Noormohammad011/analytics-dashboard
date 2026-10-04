import { filterOrdersByFuseQuery } from "@/lib/orders/fuse-search"
import { getSeedData } from "@/lib/server/data"
import { isWithinRange } from "@/lib/server/date-range"
import type { OrderListItem, OrderStatus } from "@/lib/types"

export type OrdersQuery = {
  q?: string
  status?: OrderStatus
  from?: Date
  to?: Date
  page: number
  pageSize: number
}

export const queryOrders = async (query: OrdersQuery) => {
  const { orders, customers } = await getSeedData()
  const customerById = new Map(customers.map((c) => [c.id, c]))

  let filtered = orders

  if (query.status) {
    filtered = filtered.filter((o) => o.status === query.status)
  }
  const from = query.from
  const to = query.to
  if (from && to) {
    filtered = filtered.filter((o) => isWithinRange(o.createdAt, from, to))
  } else if (from) {
    filtered = filtered.filter((o) => new Date(o.createdAt) >= from)
  } else if (to) {
    filtered = filtered.filter((o) => new Date(o.createdAt) <= to)
  }

  const searchQuery = query.q?.trim()
  if (searchQuery) {
    const rows = filtered.map((order) => ({
      order,
      customerName: customerById.get(order.customerId)?.name ?? "Unknown",
    }))
    filtered = filterOrdersByFuseQuery(rows, searchQuery).map((row) => row.order)
  }

  filtered = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const total = filtered.length
  const start = (query.page - 1) * query.pageSize
  const slice = filtered.slice(start, start + query.pageSize)

  const items: OrderListItem[] = slice.map((order) => ({
    ...order,
    customerName: customerById.get(order.customerId)?.name ?? "Unknown",
  }))

  return { items, total, page: query.page, pageSize: query.pageSize }
}

export const getOrderById = async (id: string) => {
  const { orders, customers } = await getSeedData()
  const order = orders.find((o) => o.id === id)
  if (!order) return null
  const customer = customers.find((c) => c.id === order.customerId)
  if (!customer) return null
  return {
    order,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      status: customer.status,
    },
  }
}
