import type { OrderStatus } from "@/lib/types"

export type OrdersFilterValues = {
  q: string
  status: OrderStatus | "all"
  from: string
  to: string
}

export const defaultOrdersFilterValues = (): OrdersFilterValues => ({
  q: "",
  status: "all",
  from: "",
  to: "",
})

export const hasActiveOrdersFilters = (values: OrdersFilterValues): boolean => {
  if (values.q.trim()) return true
  if (values.status !== "all") return true
  if (values.from || values.to) return true
  return false
}
