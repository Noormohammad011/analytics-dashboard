import { NextResponse } from "next/server"

import { getRecentActivities } from "@/lib/server/activities-query"
import { jsonError, parsePositiveInt } from "@/lib/server/http"

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parsePositiveInt(searchParams.get("limit"), 20, 100)
    const activities = await getRecentActivities(limit)
    return NextResponse.json({ items: activities })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load activities"
    return jsonError(400, message)
  }
}
