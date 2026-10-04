"use client"

import { ErrorState } from "@/components/feedback/error-state"
import { PageHeader } from "@/components/layout/page-header"

type DashboardErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader title="Dashboard" description="We could not load this view." />
      <ErrorState
        message={error.message || "The analytics API did not respond."}
        onRetry={reset}
      />
    </div>
  )
}
