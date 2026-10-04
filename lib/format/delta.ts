export const formatDeltaPercent = (current: number, previous: number) => {
  if (previous === 0) {
    if (current === 0) return { label: "0%", tone: "neutral" as const }
    return { label: "+100%", tone: "positive" as const }
  }
  const change = (current - previous) / previous
  const label = `${change >= 0 ? "+" : ""}${(change * 100).toFixed(1)}%`
  const tone: "positive" | "negative" | "neutral" =
    change > 0 ? "positive" : change < 0 ? "negative" : "neutral"
  return { label, tone }
}
