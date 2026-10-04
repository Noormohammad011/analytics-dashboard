"use client"

import { FilterX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { OrderStatusSelect } from "@/components/orders/order-status-select"
import { hasActiveOrdersFilters, type OrdersFilterValues } from "@/lib/orders/filters"

export type { OrdersFilterValues }

type OrdersFiltersProps = {
  values: OrdersFilterValues
  searchPending?: boolean
  onSearchChange: (q: string) => void
  onStatusChange: (status: OrdersFilterValues["status"]) => void
  onDateRangeChange: (from: string, to: string) => void
  onClearFilters: () => void
}

export const OrdersFilters = ({
  values,
  searchPending = false,
  onSearchChange,
  onStatusChange,
  onDateRangeChange,
  onClearFilters,
}: OrdersFiltersProps) => {
  const filtersActive = hasActiveOrdersFilters(values)

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="orders-search">
          Search
        </label>
        <Input
          id="orders-search"
          type="search"
          placeholder="Order id, customer, or status"
          value={values.q}
          onChange={(event) => onSearchChange(event.target.value)}
          className="min-h-11 bg-background"
          aria-busy={searchPending}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 md:w-44">
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <OrderStatusSelect value={values.status} onValueChange={onStatusChange} />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 md:w-auto md:min-w-[17rem]">
        <span className="text-xs font-medium text-muted-foreground" id="orders-date-range-label">
          Date range
        </span>
        <DateRangePicker
          id="orders-date-range"
          from={values.from}
          to={values.to}
          onRangeChange={onDateRangeChange}
          className="bg-background"
          placeholder="Pick a date range"
          aria-labelledby="orders-date-range-label"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 md:shrink-0">
        <span className="text-xs font-medium text-muted-foreground md:invisible md:h-4" aria-hidden>
          Clear
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 shrink-0 bg-background"
          disabled={!filtersActive}
          onClick={onClearFilters}
          aria-label="Clear filters"
        >
          <FilterX className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  )
}
