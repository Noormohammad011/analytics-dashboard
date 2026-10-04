"use client"

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
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-background">Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="sticky left-0 z-10 bg-background">
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => onSelectOrder(order.id)}
                >
                  {order.id}
                </button>
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell className="tabular-nums">
                {formatCents(order.amountCents, order.currency)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatOrderDate(order.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
