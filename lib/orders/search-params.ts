import type { OrdersListParams } from "@/lib/api/orders"
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types"

export type OrdersPageParams = OrdersListParams & {
  page: number
  pageSize: number
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

const readString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? ""
  return value ?? ""
}

const parsePage = (raw: string) => {
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return DEFAULT_PAGE
  return n
}

const parseStatus = (raw: string): OrderStatus | undefined => {
  if (!raw) return undefined
  if (ORDER_STATUSES.includes(raw as OrderStatus)) return raw as OrderStatus
  return undefined
}

export const parseOrdersSearchParams = (
  input: Record<string, string | string[] | undefined>,
): OrdersPageParams => {
  const q = readString(input.q).trim()
  const status = parseStatus(readString(input.status))
  const from = readString(input.from).trim()
  const to = readString(input.to).trim()
  const page = parsePage(readString(input.page))
  const pageSize = DEFAULT_PAGE_SIZE

  return {
    q: q || undefined,
    status,
    from: from || undefined,
    to: to || undefined,
    page,
    pageSize,
  }
}

export const buildOrdersQueryKey = (params: OrdersPageParams) =>
  JSON.stringify({
    q: params.q ?? "",
    status: params.status ?? "",
    from: params.from ?? "",
    to: params.to ?? "",
    page: params.page,
    pageSize: params.pageSize,
  })

export const ordersParamsToQueryString = (params: OrdersPageParams) => {
  const search = new URLSearchParams()
  if (params.q) search.set("q", params.q)
  if (params.status) search.set("status", params.status)
  if (params.from) search.set("from", params.from)
  if (params.to) search.set("to", params.to)
  if (params.page > DEFAULT_PAGE) search.set("page", String(params.page))
  return search.toString()
}

export const syncOrdersUrl = (params: OrdersPageParams) => {
  const qs = ordersParamsToQueryString(params)
  const path = qs ? `/orders?${qs}` : "/orders"
  window.history.replaceState(null, "", path)
}
