import { describe, expect, it } from "vitest"

import { formatDeltaPercent } from "@/lib/format/delta"

describe("formatDeltaPercent", () => {
  it("covers AC style prior period delta labels", () => {
    expect(formatDeltaPercent(110, 100)).toEqual({ label: "+10.0%", tone: "positive" })
    expect(formatDeltaPercent(90, 100)).toEqual({ label: "-10.0%", tone: "negative" })
    expect(formatDeltaPercent(100, 100)).toEqual({ label: "+0.0%", tone: "neutral" })
  })

  it("handles zero previous value", () => {
    expect(formatDeltaPercent(0, 0)).toEqual({ label: "0%", tone: "neutral" })
    expect(formatDeltaPercent(50, 0)).toEqual({ label: "+100%", tone: "positive" })
  })
})
