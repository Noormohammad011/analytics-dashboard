import type { ChartConfig } from "@/components/ui/chart"

/** Revenue uses chart-1, orders use chart-2 (see app/globals.css). */
export const analyticsChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig
