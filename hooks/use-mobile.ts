import * as React from "react"

/** Matches Tailwind `lg` (shell hamburger + mobile sidebar sheet). */
const MOBILE_BREAKPOINT_PX = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`)
    const sync = () => {
      setIsMobile(mql.matches)
    }
    sync()
    mql.addEventListener("change", sync)
    return () => mql.removeEventListener("change", sync)
  }, [])

  return isMobile
}
