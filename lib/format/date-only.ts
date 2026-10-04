export const parseDateOnly = (value: string): Date | undefined => {
  if (!value) return undefined
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return undefined
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined
  }
  return date
}

import { startOfDay } from "date-fns"

/** Local calendar day for “today”; used to block future dates in pickers. */
export const getTodayStart = (): Date => startOfDay(new Date())

export const clampToToday = (date: Date): Date => {
  const today = getTodayStart()
  const day = startOfDay(date)
  return day.getTime() > today.getTime() ? today : day
}

export const formatDateOnly = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
