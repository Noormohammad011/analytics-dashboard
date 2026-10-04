"use client"

import type { KeyboardEvent } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCents } from "@/lib/format/currency"
import type { OrderListItem } from "@/lib/types"

type OrdersDataTableProps = {
  orders: OrderListItem[]
  onSelectOrder: (id: string) => void
}

const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export const OrdersDataTable = ({ orders, onSelectOrder }: OrdersDataTableProps) => {
  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, orderId: string) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    onSelectOrder(orderId)
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              tabIndex={0}
              role="button"
              aria-label={`View order for ${order.customerName}`}
              className="cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              onClick={() => onSelectOrder(order.id)}
              onKeyDown={(event) => handleRowKeyDown(event, order.id)}
            >
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell className="tabular-nums">
                {formatCents(order.amountCents, order.currency)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatOrderDate(order.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
