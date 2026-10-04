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
import { formatCents } from "@/lib/format/currency"
import type { TimeSeriesPoint } from "@/lib/types"

type RevenueLineChartProps = {
  points: TimeSeriesPoint[]
}

export const RevenueLineChart = ({ points }: RevenueLineChartProps) => {
  const data = points.map((point) => ({
    date: point.date,
    revenue: point.value,
  }))

  return (
    <FadeInItem>
      <ChartCard title="Revenue" description="Last 30 days (paid + shipped)">
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => formatCents(Number(v))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCents(Number(value))}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </ChartCard>
    </FadeInItem>
  )
}
