import { NextResponse } from "next/server"

import { jsonError } from "@/lib/server/http"
import { getOrderById } from "@/lib/server/orders-query"

type RouteContext = {
  params: Promise<{ id: string }>
}

export const GET = async (_request: Request, context: RouteContext) => {
  const { id } = await context.params
  const detail = await getOrderById(id)
  if (!detail) {
    return jsonError(404, "Order not found")
  }
  return NextResponse.json(detail)
}
