import { describe, expect, it } from "vitest"

import {
  buildOrdersQueryKey,
  ordersParamsToQueryString,
  parseOrdersSearchParams,
} from "@/lib/orders/search-params"

describe("parseOrdersSearchParams", () => {
  it("parses combined filters for API and URL (AC-3)", () => {
    const params = parseOrdersSearchParams({
      q: "ord_0001",
      status: "paid",
      from: "2026-01-01",
      to: "2026-12-31",
      page: "2",
    })
    expect(params.q).toBe("ord_0001")
    expect(params.status).toBe("paid")
    expect(params.from).toBe("2026-01-01")
    expect(params.to).toBe("2026-12-31")
    expect(params.page).toBe(2)
  })

  it("serializes pagination without dropping filters (AC-4)", () => {
    const params = parseOrdersSearchParams({
      q: "kai",
      status: "shipped",
      page: "3",
    })
    const qs = ordersParamsToQueryString(params)
    expect(qs).toContain("q=kai")
    expect(qs).toContain("status=shipped")
    expect(qs).toContain("page=3")
  })

  it("builds stable query keys (AC-7)", () => {
    const a = buildOrdersQueryKey(
      parseOrdersSearchParams({ q: "x", page: "1" }),
    )
    const b = buildOrdersQueryKey(
      parseOrdersSearchParams({ q: "x", page: "1" }),
    )
    expect(a).toBe(b)
  })
})
