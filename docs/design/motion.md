# Motion system

Built on the `motion` package (`motion/react`). Honors `prefers-reduced-motion` everywhere.

## Durations

| Token | MS | Use |
| --- | --- | --- |
| `duration-fast` | 150 | Hover affordances |
| `duration-normal` | 200 | Buttons, badges |
| `duration-slow` | 300 | Sheet, sidebar mobile |

Constants live in `lib/motion/tokens.ts`.

## Easing

| Token | Curve |
| --- | --- |
| `ease-enter` | cubic-bezier(0.16, 1, 0.3, 1) |
| `ease-exit` | cubic-bezier(0.4, 0, 1, 1) |

## Patterns

1. **KPI stagger** (dashboard only): `StaggerChildren` + `FadeInItem`, 40ms between children. Disabled when reduced motion is on.
2. **Section enter**: single `FadeInItem` on chart cards, opacity + translateY 8px max.
3. **Overlays**: shadcn `Sheet` uses `duration-slow`; do not add extra motion on top unless showing content swap.
4. **Loading**: shadcn `Skeleton` pulse; optional cross fade via `FadeInItem` when data arrives.
5. **Never**: stagger every section on the page, or animate layout properties on large tables.

## Reduced motion

`MotionProvider` sets `reducedMotion="user"`. `usePrefersReducedMotion` in `lib/motion/use-prefers-reduced-motion.ts` gates stagger and enter animations.

## Implementation map

| UI | Module |
| --- | --- |
| App wide | `components/layout/motion-provider.tsx` |
| KPI row | `components/dashboard/kpi-card.tsx` inside `StaggerChildren` |
| Charts | `components/dashboard/chart-card.tsx` wraps `FadeInItem` |
