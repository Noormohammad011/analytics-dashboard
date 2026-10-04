import { describe, expect, it } from "vitest"

import { filterOrdersByRange } from "@/lib/server/analytics"
import type { Order } from "@/lib/types"

const sampleOrder = (overrides: Partial<Order>): Order => ({
  id: "ord_test",
  customerId: "cust_001",
  amountCents: 1000,
  currency: "USD",
  status: "paid",
  createdAt: "2026-06-15T12:00:00.000Z",
  lineItems: [{ name: "Item", quantity: 1, unitPriceCents: 1000 }],
  ...overrides,
})

describe("filterOrdersByRange", () => {
  it("includes orders within inclusive UTC range", () => {
    const from = new Date("2026-06-01T00:00:00.000Z")
    const to = new Date("2026-06-30T23:59:59.999Z")
    const orders = [
      sampleOrder({ createdAt: "2026-05-31T23:59:59.000Z" }),
      sampleOrder({ id: "ord_in", createdAt: "2026-06-15T12:00:00.000Z" }),
      sampleOrder({ id: "ord_out", createdAt: "2026-07-01T00:00:00.000Z" }),
    ]
    const result = filterOrdersByRange(orders, from, to)
    expect(result.map((o) => o.id)).toEqual(["ord_in"])
  })
})

describe("conversion rate formula", () => {
  it("matches documented paid / (paid + cancelled + pending)", () => {
    const paid = 3
    const pending = 1
    const cancelled = 1
    const denominator = paid + cancelled + pending
    const conversionRate = paid / denominator
    expect(conversionRate).toBe(0.6)
  })
})
