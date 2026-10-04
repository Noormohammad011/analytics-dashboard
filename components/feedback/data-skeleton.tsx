import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type DataSkeletonProps = {
  rows?: number
  className?: string
}

export const DataSkeleton = ({ rows = 3, className }: DataSkeletonProps) => {
  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading content"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-lg" />
      ))}
    </div>
  )
}
