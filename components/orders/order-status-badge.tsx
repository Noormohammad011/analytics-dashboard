import { Badge } from "@/components/ui/badge"
import { getOrderStatusBadgeVariant } from "@/lib/format/status-badge"
import type { OrderStatus } from "@/lib/types"

type OrderStatusBadgeProps = {
  status: OrderStatus
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <Badge variant={getOrderStatusBadgeVariant(status)} className="capitalize">
    {status}
  </Badge>
)
