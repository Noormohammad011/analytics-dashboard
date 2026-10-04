import { NextResponse } from "next/server"

import { parseIsoDate } from "@/lib/server/date-range"
import { jsonError, parsePositiveInt } from "@/lib/server/http"
import { queryOrders } from "@/lib/server/orders-query"
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types"

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parsePositiveInt(searchParams.get("page"), 1)
    const pageSize = parsePositiveInt(searchParams.get("pageSize"), 10, 50)
    const statusParam = searchParams.get("status")
    let status: OrderStatus | undefined
    if (statusParam) {
      if (!ORDER_STATUSES.includes(statusParam as OrderStatus)) {
        return jsonError(400, "Invalid status")
      }
      status = statusParam as OrderStatus
    }

    const fromRaw = searchParams.get("from")
    const toRaw = searchParams.get("to")
    const from = fromRaw ? parseIsoDate(fromRaw, "from") : undefined
    const to = toRaw ? parseIsoDate(toRaw, "to") : undefined
    if (from && to && from > to) {
      return jsonError(400, "from must be before to")
    }

    const result = await queryOrders({
      q: searchParams.get("q") ?? undefined,
      status,
      from,
      to,
      page,
      pageSize,
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load orders"
    return jsonError(400, message)
  }
}
