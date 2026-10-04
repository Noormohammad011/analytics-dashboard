"use client"

import { KpiCard } from "@/components/dashboard/kpi-card"
import { FadeInItem, StaggerChildren } from "@/components/motion/stagger-children"
import type { DashboardKpi } from "@/lib/dashboard/get-dashboard-data"

type DashboardKpiGridProps = {
  kpis: DashboardKpi[]
}

export const DashboardKpiGrid = ({ kpis }: DashboardKpiGridProps) => {
  return (
    <StaggerChildren className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <FadeInItem key={kpi.label}>
          <KpiCard
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaTone={kpi.deltaTone}
          />
        </FadeInItem>
      ))}
    </StaggerChildren>
  )
}
