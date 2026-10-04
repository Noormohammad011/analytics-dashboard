const MS_DAY = 24 * 60 * 60 * 1000

export const parseIsoDate = (value: string, label: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid ${label} date`)
  }
  return parsed
}

export const defaultRangeLastDays = (days: number) => {
  const to = new Date()
  to.setUTCHours(23, 59, 59, 999)
  const from = new Date(to.getTime() - (days - 1) * MS_DAY)
  from.setUTCHours(0, 0, 0, 0)
  return { from, to }
}

export const resolveRange = (fromParam?: string | null, toParam?: string | null) => {
  if (!fromParam && !toParam) {
    return defaultRangeLastDays(30)
  }
  const to = toParam ? parseIsoDate(toParam, "to") : new Date()
  const from = fromParam
    ? parseIsoDate(fromParam, "from")
    : new Date(to.getTime() - 29 * MS_DAY)
  if (from > to) {
    throw new Error("from must be before to")
  }
  return { from, to }
}

export const isWithinRange = (iso: string, from: Date, to: Date) => {
  const t = new Date(iso).getTime()
  return t >= from.getTime() && t <= to.getTime()
}

export const toDateKey = (iso: string) => iso.slice(0, 10)
