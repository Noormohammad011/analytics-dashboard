import Link from "next/link"

import { cn } from "@/lib/utils"

type AppLogoProps = {
  variant?: "full" | "mark"
  className?: string
  href?: string
}

export const AppLogoMark = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-chart-1 to-chart-2 text-primary-foreground shadow-sm ring-1 ring-chart-1/20",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 32 32" className="size-5" fill="none">
        <path
          d="M6 22V14M12 22V10M18 22V16M24 22V8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M5 24.5C9 20 14 19 18 21.5C22 24 26 23 27 21"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    </span>
  )
}

export const AppLogo = ({ variant = "full", className, href = "/" }: AppLogoProps) => {
  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <AppLogoMark />
      {variant === "full" ? (
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-semibold tracking-tight text-sidebar-foreground">
            Pulseboard
          </span>
          <span className="truncate text-xs text-muted-foreground">Analytics console</span>
        </div>
      ) : null}
    </div>
  )

  return (
    <Link
      href={href}
      className="rounded-md outline-none ring-sidebar-ring transition-opacity hover:opacity-90 focus-visible:ring-2"
      aria-label="Pulseboard home"
    >
      {content}
    </Link>
  )
}
