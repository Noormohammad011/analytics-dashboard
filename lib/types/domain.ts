export const ORDER_STATUSES = [
  "pending",
  "paid",
  "shipped",
  "cancelled",
  "refunded",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const CUSTOMER_STATUSES = ["active", "churned"] as const

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]

export const ACTIVITY_TYPES = [
  "order_created",
  "payment_failed",
  "shipment",
  "system",
] as const

export type ActivityType = (typeof ACTIVITY_TYPES)[number]

export type LineItem = {
  name: string
  quantity: number
  unitPriceCents: number
}

export type Customer = {
  id: string
  name: string
  email: string
  createdAt: string
  status: CustomerStatus
}

export type Order = {
  id: string
  customerId: string
  amountCents: number
  currency: string
  status: OrderStatus
  createdAt: string
  lineItems: LineItem[]
}

export type ActivityMetadata = {
  orderId?: string
  customerId?: string
}

export type Activity = {
  id: string
  type: ActivityType
  message: string
  createdAt: string
  metadata?: ActivityMetadata
}

export type TimeSeriesPoint = {
  date: string
  value: number
}

export type AnalyticsSummary = {
  revenueCents: number
  orderCount: number
  activeCustomers: number
  conversionRate: number
  from: string
  to: string
}

export type PaginatedOrders = {
  items: OrderListItem[]
  total: number
  page: number
  pageSize: number
}

export type OrderListItem = Order & {
  customerName: string
}

export type OrderDetail = {
  order: Order
  customer: Pick<Customer, "id" | "name" | "email" | "status">
}
