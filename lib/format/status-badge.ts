import type { VariantProps } from "class-variance-authority"

import type { badgeVariants } from "@/components/ui/badge"
import type { ActivityType, CustomerStatus, OrderStatus } from "@/lib/types"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export const getOrderStatusBadgeVariant = (status: OrderStatus): BadgeVariant => {
  switch (status) {
    case "paid":
      return "success"
    case "shipped":
      return "info"
    case "pending":
      return "warning"
    case "cancelled":
      return "destructive"
    case "refunded":
      return "neutral"
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export const getCustomerStatusBadgeVariant = (status: CustomerStatus): BadgeVariant => {
  switch (status) {
    case "active":
      return "success"
    case "churned":
      return "neutral"
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export const getActivityTypeBadgeVariant = (type: ActivityType): BadgeVariant => {
  switch (type) {
    case "order_created":
      return "info"
    case "payment_failed":
      return "destructive"
    case "shipment":
      return "success"
    case "system":
      return "neutral"
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

export const getDeltaToneBadgeVariant = (
  tone: "positive" | "negative" | "neutral",
): BadgeVariant => {
  switch (tone) {
    case "positive":
      return "success"
    case "negative":
      return "destructive"
    case "neutral":
      return "neutral"
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}
