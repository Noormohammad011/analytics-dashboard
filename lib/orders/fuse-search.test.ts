import { describe, expect, it } from "vitest"

import { filterOrdersByFuseQuery, type OrderSearchRow } from "@/lib/orders/fuse-search"
import type { Order } from "@/lib/types"

const makeRow = (partial: Partial<Order> & { customerName: string }): OrderSearchRow => ({
  order: {
    id: partial.id ?? "ord_0001",
    customerId: "cust_001",
    amountCents: 1000,
    currency: "USD",
    status: partial.status ?? "pending",
    createdAt: "2026-10-01T12:00:00.000Z",
    lineItems: [],
  },
  customerName: partial.customerName,
})

describe("filterOrdersByFuseQuery", () => {
  const rows: OrderSearchRow[] = [
    makeRow({ id: "ord_0042", customerName: "Kai Singh", status: "shipped" }),
    makeRow({ id: "ord_0099", customerName: "Zoe Nguyen", status: "paid" }),
  ]

  it("returns all rows when query is empty", () => {
    expect(filterOrdersByFuseQuery(rows, "")).toHaveLength(2)
    expect(filterOrdersByFuseQuery(rows, "   ")).toHaveLength(2)
  })

  it("ranks order id match first", () => {
    const result = filterOrdersByFuseQuery(rows, "ord_0042")
    expect(result[0]?.order.id).toBe("ord_0042")
  })

  it("fuzzy matches customer name with typos", () => {
    const result = filterOrdersByFuseQuery(rows, "kai sing")
    expect(result.some((r) => r.customerName === "Kai Singh")).toBe(true)
  })
})
