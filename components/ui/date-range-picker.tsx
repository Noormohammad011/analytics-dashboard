"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { clampToToday, formatDateOnly, getTodayStart, parseDateOnly } from "@/lib/format/date-only"
import { isRangeSelectionComplete } from "@/lib/format/date-range-picker"
import { cn } from "@/lib/utils"

type DateRangePickerProps = {
  from: string
  to: string
  onRangeChange: (from: string, to: string) => void
  className?: string
  id?: string
  placeholder?: string
  "aria-labelledby"?: string
}

const toDateRange = (from: string, to: string): DateRange | undefined => {
  const fromDate = parseDateOnly(from)
  const toDate = parseDateOnly(to)
  if (!fromDate && !toDate) return undefined
  return { from: fromDate, to: toDate }
}

const formatRangeLabel = (from: string, to: string, placeholder: string): string => {
  const fromDate = parseDateOnly(from)
  const toDate = parseDateOnly(to)
  if (fromDate && toDate) {
    return `${format(fromDate, "LLL d, y")} – ${format(toDate, "LLL d, y")}`
  }
  if (fromDate) {
    return format(fromDate, "LLL d, y")
  }
  return placeholder
}

export const DateRangePicker = ({
  from,
  to,
  onRangeChange,
  className,
  id,
  placeholder = "Pick a date range",
  "aria-labelledby": ariaLabelledBy,
}: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()
  const range = toDateRange(from, to)
  const hasValue = Boolean(from || to)
  const label = formatRangeLabel(from, to, placeholder)

  const handleSelect = (next: DateRange | undefined) => {
    if (!next) {
      onRangeChange("", "")
      return
    }
    const fromDate = next.from ? clampToToday(next.from) : undefined
    const toDate = next.to ? clampToToday(next.to) : undefined
    const fromStr = fromDate ? formatDateOnly(fromDate) : ""
    const toStr = toDate ? formatDateOnly(toDate) : ""
    onRangeChange(fromStr, toStr)
    if (isRangeSelectionComplete(next)) {
      setOpen(false)
    }
  }

  const handleClear = () => {
    onRangeChange("", "")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            aria-labelledby={ariaLabelledBy}
            data-empty={hasValue ? undefined : ""}
            className={cn(
              "min-h-11 w-full justify-start gap-2 px-2.5 text-left font-normal md:min-w-[17rem]",
              "data-[empty]:text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon className="size-4 shrink-0" aria-hidden />
        <span className="truncate tabular-nums">{label}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={8}>
        <Calendar
          mode="range"
          min={1}
          defaultMonth={range?.from ?? range?.to ?? getTodayStart()}
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={isMobile ? 1 : 2}
          disabled={{ after: getTodayStart() }}
        />
        {hasValue ? (
          <div className="border-t border-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-full text-muted-foreground"
              onClick={handleClear}
            >
              Clear range
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
