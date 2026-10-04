import { describe, expect, it } from "vitest"

import {
  getDeltaToneBadgeVariant,
  getOrderStatusBadgeVariant,
} from "@/lib/format/status-badge"

describe("getOrderStatusBadgeVariant", () => {
  it("maps paid to success", () => {
    expect(getOrderStatusBadgeVariant("paid")).toBe("success")
  })

  it("maps pending to warning", () => {
    expect(getOrderStatusBadgeVariant("pending")).toBe("warning")
  })
})

describe("getDeltaToneBadgeVariant", () => {
  it("maps positive tone to success", () => {
    expect(getDeltaToneBadgeVariant("positive")).toBe("success")
  })
})
