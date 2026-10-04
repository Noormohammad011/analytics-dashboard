# Design tokens

Operator console aesthetic: calm, data first, no marketing gradients. Aligned with **creative-design** (credible SaaS tool) and **frontend-design** (restraint, one bold moment on KPI load).

## Typography

| Role | Token | Usage |
| --- | --- | --- |
| UI sans | `font-sans` (Geist via Next font) | Body, labels, nav |
| Mono | `font-mono` (Geist Mono) | Order ids, codes |
| KPI values | `tabular-nums` + `text-2xl font-semibold` | Metric cards |
| Page title | `text-2xl font-semibold tracking-tight` | `PageHeader` |
| Muted | `text-sm text-muted-foreground` | Supporting copy |

Scale: 12 / 14 / 16 / 20 / 24 px via Tailwind `text-xs` through `text-2xl`.

## Color (semantic)

Use shadcn tokens only in components. Do not use raw `bg-blue-500` in feature UI.

| Semantic | CSS variable | Role |
| --- | --- | --- |
| Surface | `--background`, `--card` | Page and panels |
| Text | `--foreground`, `--muted-foreground` | Primary and secondary text |
| Action | `--primary` | Primary buttons |
| Chart revenue | `--chart-1` | Revenue series |
| Chart orders | `--chart-2` | Orders series |
| Destructive | `--destructive` | Errors, failed payments |

Chart mapping is defined in `app/globals.css` (`--chart-1`, `--chart-2`).

## Spacing and layout

| Pattern | Class |
| --- | --- |
| Page padding | `p-6` |
| Section gap | `flex flex-col gap-6` |
| KPI grid | `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4` |
| Card internal | `flex flex-col gap-4` (not `space-y-*`) |

## Touch and focus

- Minimum tap target: `size-11` (44px) on `SidebarTrigger` and primary icon controls.
- Focus: rely on shadcn `ring` / `outline-ring` on interactive elements.

## Console sidebar (spec 0006)

| Element | Treatment |
| --- | --- |
| Group labels | `WORKSPACE`, `PROJECT`, `ENVIRONMENT` uppercase, 11px, muted |
| Active nav | 3px left rail `--sidebar-primary`, row tint `sidebar-primary/10`, blue icon |
| Environment pill | Badge `info` variant, label `Seed` |
| Collapsed | Icon rail + tooltips on nav; env dot replaces pill |

## Status badges

Semantic Badge variants: `success`, `warning`, `info`, `destructive`, `neutral`. Mapping lives in `lib/format/status-badge.ts`.

| Domain | Example mapping |
| --- | --- |
| Order status | paid → success, shipped → info, pending → warning |
| KPI delta | positive → success, negative → destructive |
| Activity type | payment_failed → destructive, shipment → success |

## Loading

`skeleton-shimmer` utility in `app/globals.css`: gradient sweep on `Skeleton`; `prefers-reduced-motion` disables sweep, keeps static muted fill.
