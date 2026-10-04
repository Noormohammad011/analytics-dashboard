import Link from "next/link"

import { cn } from "@/lib/utils"

type AppLogoProps = {
  variant?: "full" | "mark"
  density?: "default" | "chrome"
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

export const AppLogo = ({
  variant = "full",
  density = "default",
  className,
  href = "/",
}: AppLogoProps) => {
  const chrome = density === "chrome"

  const content = (
    <div
      className={cn(
        "flex w-full min-w-0 items-center justify-start",
        chrome ? "gap-2.5" : "gap-3",
        className,
      )}
    >
      <AppLogoMark
        className={cn(chrome || variant === "mark" ? "size-8 [&_svg]:size-4" : undefined)}
      />
      {variant === "full" ? (
        <div className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "truncate font-semibold tracking-tight text-sidebar-foreground",
              chrome ? "text-sm" : undefined,
            )}
          >
            Pulseboard
          </span>
          <span
            className={cn(
              "truncate text-muted-foreground",
              chrome ? "text-[11px]" : "text-xs",
            )}
          >
            Analytics console
          </span>
        </div>
      ) : null}
    </div>
  )

  return (
    <Link
      href={href}
      className="flex w-full justify-start rounded-md outline-none ring-sidebar-ring transition-opacity hover:opacity-90 focus-visible:ring-2"
      aria-label="Pulseboard home"
    >
      {content}
    </Link>
  )
}
