import { describe, expect, it } from "vitest"

import { isRangeSelectionComplete } from "@/lib/format/date-range-picker"

describe("isRangeSelectionComplete", () => {
  it("returns false when only the start date is set", () => {
    const start = new Date(2026, 9, 1)
    expect(isRangeSelectionComplete({ from: start, to: undefined })).toBe(false)
  })

  it("returns false when start and end are the same day", () => {
    const day = new Date(2026, 9, 1)
    expect(isRangeSelectionComplete({ from: day, to: day })).toBe(false)
  })

  it("returns true when start and end are different days", () => {
    expect(
      isRangeSelectionComplete({
        from: new Date(2026, 9, 1),
        to: new Date(2026, 9, 15),
      }),
    ).toBe(true)
  })
})
