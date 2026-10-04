import { Skeleton } from "@/components/ui/skeleton"

export const DetailSheetSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading order details"
    >
      <div className="rounded-lg border border-border p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-4 w-48" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-7 w-24" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}
