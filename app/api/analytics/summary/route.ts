import { NextResponse } from "next/server"

import { computeSummary } from "@/lib/server/analytics"
import { resolveRange } from "@/lib/server/date-range"
import { jsonError } from "@/lib/server/http"

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const { from, to } = resolveRange(
      searchParams.get("from"),
      searchParams.get("to"),
    )
    const summary = await computeSummary(from, to)
    return NextResponse.json(summary)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load summary"
    return jsonError(400, message)
  }
}
