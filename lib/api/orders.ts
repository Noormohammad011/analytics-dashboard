import type { OrderDetail, OrderStatus, PaginatedOrders } from "@/lib/types"

import { fetchJson } from "@/lib/api/http"

export type OrdersListParams = {
  q?: string
  status?: OrderStatus
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const getOrders = (params: OrdersListParams = {}) => {
  const search = new URLSearchParams()
  if (params.q) search.set("q", params.q)
  if (params.status) search.set("status", params.status)
  if (params.from) search.set("from", params.from)
  if (params.to) search.set("to", params.to)
  if (params.page) search.set("page", String(params.page))
  if (params.pageSize) search.set("pageSize", String(params.pageSize))
  const qs = search.toString()
  return fetchJson<PaginatedOrders>(`/api/orders${qs ? `?${qs}` : ""}`)
}

export const getOrderById = (id: string) => fetchJson<OrderDetail>(`/api/orders/${id}`)
