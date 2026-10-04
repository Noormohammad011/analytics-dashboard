import { NextResponse } from "next/server"

import { computeOrdersSeries } from "@/lib/server/analytics"
import { resolveRange } from "@/lib/server/date-range"
import { jsonError } from "@/lib/server/http"

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const { from, to } = resolveRange(
      searchParams.get("from"),
      searchParams.get("to"),
    )
    const data = await computeOrdersSeries(from, to)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load orders series"
    return jsonError(400, message)
  }
}
