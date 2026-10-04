import type { Activity } from "@/lib/types"

import { fetchJson } from "@/lib/api/http"

type ActivitiesResponse = { items: Activity[] }

export const getActivities = (limit = 20) =>
  fetchJson<ActivitiesResponse>(`/api/activities?limit=${limit}`)
