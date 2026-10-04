import type { DateRange } from "react-day-picker"

export const isRangeSelectionComplete = (range: DateRange | undefined): boolean => {
  if (!range?.from || !range.to) return false
  return range.from.getTime() !== range.to.getTime()
}
