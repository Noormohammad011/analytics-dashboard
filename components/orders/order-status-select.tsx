"use client"

import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrdersFilterValues } from "@/lib/orders/filters"
import { ORDER_STATUSES } from "@/lib/types"

type OrderStatusSelectProps = {
  value: OrdersFilterValues["status"]
  onValueChange: (status: OrdersFilterValues["status"]) => void
}

export const OrderStatusSelect = ({ value, onValueChange }: OrderStatusSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OrdersFilterValues["status"])}
    >
      <SelectTrigger className="min-h-11 w-full bg-background">
        {value === "all" ? (
          <SelectValue placeholder="All statuses" />
        ) : (
          <OrderStatusBadge status={value} />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="text-sm text-foreground">All statuses</span>
        </SelectItem>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status} value={status} className="py-2">
            <OrderStatusBadge status={status} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
