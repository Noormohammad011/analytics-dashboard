"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { ErrorState } from "@/components/feedback/error-state"
import { getOrderById } from "@/lib/api/orders"
import { ApiError } from "@/lib/api/http"
import { formatCents } from "@/lib/format/currency"
import type { OrderDetail } from "@/lib/types"

type OrderDetailSheetProps = {
  orderId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const OrderDetailSheet = ({ orderId, open, onOpenChange }: OrderDetailSheetProps) => {
  const [detail, setDetail] = React.useState<OrderDetail | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loadedOrderId, setLoadedOrderId] = React.useState<string | null>(null)
  const [retryNonce, setRetryNonce] = React.useState(0)

  const loading = Boolean(open && orderId && loadedOrderId !== orderId && !error)

  React.useEffect(() => {
    if (!open || !orderId) return
    let cancelled = false
    getOrderById(orderId)
      .then((data) => {
        if (cancelled) return
        setDetail(data)
        setLoadedOrderId(orderId)
        setError(null)
      })
      .catch((err) => {
        if (cancelled) return
        const message =
          err instanceof ApiError ? err.message : "Could not load order details"
        setError(message)
        setDetail(null)
        setLoadedOrderId(orderId)
      })
    return () => {
      cancelled = true
    }
  }, [open, orderId, retryNonce])

  const handleRetry = () => {
    setError(null)
    setLoadedOrderId(null)
    setRetryNonce((n) => n + 1)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{orderId ? `Order ${orderId}` : "Order details"}</SheetTitle>
          <SheetDescription>Line items and customer summary</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </div>
          ) : null}
          {error ? <ErrorState message={error} onRetry={handleRetry} /> : null}
          {detail && !loading && !error ? (
            <>
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm font-medium">{detail.customer.name}</p>
                <p className="text-sm text-muted-foreground">{detail.customer.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{detail.customer.status}</Badge>
                  <Badge variant="outline">{detail.order.status}</Badge>
                </div>
                <p className="mt-3 text-lg font-semibold tabular-nums">
                  {formatCents(detail.order.amountCents, detail.order.currency)}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Line items</h3>
                <ul className="flex flex-col gap-2">
                  {detail.order.lineItems.map((item) => (
                    <li
                      key={`${item.name}-${item.unitPriceCents}`}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatCents(item.unitPriceCents * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
