"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types"

export type OrdersFilterValues = {
  q: string
  status: OrderStatus | "all"
  from: string
  to: string
}

type OrdersFiltersProps = {
  values: OrdersFilterValues
  onSearchChange: (q: string) => void
  onStatusChange: (status: OrdersFilterValues["status"]) => void
  onFromChange: (from: string) => void
  onToChange: (to: string) => void
}

export const OrdersFilters = ({
  values,
  onSearchChange,
  onStatusChange,
  onFromChange,
  onToChange,
}: OrdersFiltersProps) => {
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
          className="min-h-11"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 md:w-44">
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <Select
          value={values.status}
          onValueChange={(next) => onStatusChange(next as OrdersFilterValues["status"])}
        >
          <SelectTrigger className="min-h-11 w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 md:w-40">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="orders-from">
          From
        </label>
        <Input
          id="orders-from"
          type="date"
          value={values.from}
          onChange={(event) => onFromChange(event.target.value)}
          className="min-h-11"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 md:w-40">
        <label className="text-xs font-medium text-muted-foreground" htmlFor="orders-to">
          To
        </label>
        <Input
          id="orders-to"
          type="date"
          value={values.to}
          onChange={(event) => onToChange(event.target.value)}
          className="min-h-11"
        />
      </div>
    </div>
  )
}
