import { describe, expect, it } from "vitest"

import { clampToToday, getTodayStart } from "@/lib/format/date-only"

describe("clampToToday", () => {
  it("clamps future dates to today", () => {
    const today = getTodayStart()
    const future = new Date(today)
    future.setDate(future.getDate() + 5)
    const clamped = clampToToday(future)
    expect(clamped.getTime()).toBe(today.getTime())
  })

  it("keeps past dates unchanged", () => {
    const past = new Date(2020, 0, 15)
    expect(clampToToday(past).getTime()).toBe(past.getTime())
  })
})
