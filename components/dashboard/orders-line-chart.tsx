"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartCard } from "@/components/dashboard/chart-card"
import { FadeInItem } from "@/components/motion/stagger-children"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { analyticsChartConfig } from "@/lib/charts/config"
import type { TimeSeriesPoint } from "@/lib/types"

type OrdersLineChartProps = {
  points: TimeSeriesPoint[]
}

export const OrdersLineChart = ({ points }: OrdersLineChartProps) => {
  const data = points.map((point) => ({
    date: point.date,
    orders: point.value,
  }))

  return (
    <FadeInItem>
      <ChartCard title="Orders" description="Order volume by day">
        <ChartContainer
          config={analyticsChartConfig}
          className="min-h-[240px] w-full md:min-h-[320px]"
        >
          <LineChart data={data} accessibilityLayer margin={{ left: 8, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </ChartCard>
    </FadeInItem>
  )
}
