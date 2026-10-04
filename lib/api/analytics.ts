import type { AnalyticsSummary, TimeSeriesPoint } from "@/lib/types"

import { fetchJson } from "@/lib/api/http"

type SeriesResponse = { points: TimeSeriesPoint[] }

export const getAnalyticsSummary = (params?: { from?: string; to?: string }) => {
  const search = new URLSearchParams()
  if (params?.from) search.set("from", params.from)
  if (params?.to) search.set("to", params.to)
  const qs = search.toString()
  return fetchJson<AnalyticsSummary>(`/api/analytics/summary${qs ? `?${qs}` : ""}`)
}

export const getRevenueSeries = (params?: { from?: string; to?: string }) => {
  const search = new URLSearchParams()
  if (params?.from) search.set("from", params.from)
  if (params?.to) search.set("to", params.to)
  const qs = search.toString()
  return fetchJson<SeriesResponse>(`/api/analytics/revenue${qs ? `?${qs}` : ""}`)
}

export const getOrdersSeries = (params?: { from?: string; to?: string }) => {
  const search = new URLSearchParams()
  if (params?.from) search.set("from", params.from)
  if (params?.to) search.set("to", params.to)
  const qs = search.toString()
  return fetchJson<SeriesResponse>(`/api/analytics/orders-series${qs ? `?${qs}` : ""}`)
}
