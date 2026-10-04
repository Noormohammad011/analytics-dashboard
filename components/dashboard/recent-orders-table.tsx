import Link from "next/link"

import { ChartCard } from "@/components/dashboard/chart-card"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
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

type RecentOrdersTableProps = {
  orders: OrderListItem[]
}

export const RecentOrdersTable = ({ orders }: RecentOrdersTableProps) => {
  return (
    <ChartCard title="Recent orders" description="Latest five orders">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  href={`/orders?q=${encodeURIComponent(order.id)}`}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {order.id}
                </Link>
              </TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCents(order.amountCents, order.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ChartCard>
  )
}
