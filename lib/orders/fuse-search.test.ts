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

  it("matches a single order id exactly", () => {
    const result = filterOrdersByFuseQuery(rows, "ord_0042")
    expect(result).toHaveLength(1)
    expect(result[0]?.order.id).toBe("ord_0042")
  })

  it("does not treat similar order ids as one fuzzy blob", () => {
    const many: OrderSearchRow[] = [
      makeRow({ id: "ord_0013", customerName: "A" }),
      makeRow({ id: "ord_0008", customerName: "B" }),
      makeRow({ id: "ord_0012", customerName: "C" }),
    ]
    expect(filterOrdersByFuseQuery(many, "ord_0013")).toHaveLength(1)
    expect(filterOrdersByFuseQuery(many, "ord_0013")[0]?.order.id).toBe("ord_0013")
  })

  it("filters by customer id", () => {
    const byCustomer: OrderSearchRow[] = [
      makeRow({ id: "ord_a", customerName: "A" }),
      makeRow({ id: "ord_b", customerName: "B" }),
    ]
    byCustomer[0].order.customerId = "cust_009"
    byCustomer[1].order.customerId = "cust_014"
    expect(filterOrdersByFuseQuery(byCustomer, "cust_009")).toHaveLength(1)
    expect(filterOrdersByFuseQuery(byCustomer, "cust_009")[0]?.order.id).toBe("ord_a")
  })

  it("fuzzy matches customer name with typos", () => {
    const result = filterOrdersByFuseQuery(rows, "kai sing")
    expect(result.some((r) => r.customerName === "Kai Singh")).toBe(true)
  })
})
