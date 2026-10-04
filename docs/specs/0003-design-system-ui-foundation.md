# 0003. Design system, motion, and UI foundation

**Date**: 2026-10-04
**Status**: Accepted

## Summary

Establish a calm, credible SaaS analytics look (operator console, not a marketing landing page). Use shadcn/ui tokens, a responsive collapsible shell, shared feedback components, and a small motion system built on the `motion` package. WCAG AA contrast for text and chart colors. Responsive and motion rules in `docs/scope/scope.md` are binding for all UI work.

## Requirements

**Acceptance criteria**:

- **AC-1**: `components/layout/app-shell.tsx` provides sidebar nav (Dashboard, Orders), header with title slot; sidebar from `lg` up, sheet or drawer nav below `lg`.
- **AC-2**: `components/feedback/` exports `DataSkeleton`, `EmptyState`, `ErrorState` with consistent copy; skeleton uses pulse or shimmer with reduced motion fallback.
- **AC-3**: Typography uses one sans for UI and tabular nums for KPIs; light mode polished; type scale documented.
- **AC-4**: Chart palette uses semantic colors (revenue primary, orders secondary) with legend and tooltips.
- **AC-5**: Focus rings visible on interactive controls; table rows keyboard reachable where applicable.
- **AC-6**: `docs/design/motion.md` (or equivalent) documents durations, easings, stagger policy, and `prefers-reduced-motion` behavior.
- **AC-7**: Shared `MotionProvider` or utility wraps stagger children; drawer and sheet use 250 to 300ms enter and exit.
- **AC-8**: Touch targets at least 44px on primary nav and icon buttons on mobile.

## Decision

**Chosen direction**: shadcn/ui **base-nova** initialized (`components.json`, `app/globals.css`). Typography from Next/Geist until `creative-design` + `frontend-design` pass updates tokens. Animation via `motion` (Framer Motion for React) on top of shadcn primitives.

**shadcn**: use `pnpm dlx shadcn@latest add` for new primitives; compose Sidebar + Card + Table + Sheet + Chart per the shadcn skill (semantic colors, `Field`/`Empty`/`Skeleton`, no `space-y-*`).

**Implementation skills**: `creative-design` (`.cursor/skills/creative-design/`) · `frontend-design` (`.cursor/skills/frontend-design/`) · `web-design-guidelines` (`.cursor/skills/web-design-guidelines/`) · `composition-patterns` (`.cursor/skills/composition-patterns/`)

## Feature design

**Component inventory**: AppShell, MobileNavSheet, NavItem, PageHeader, KpiCard, ChartCard, DataTable wrapper, Badge for order status, DateRangePicker, `AnimatedPresence` wrapper for route or section enter.

**Motion tokens (summary)**:

| Token | Value | Use |
| --- | --- | --- |
| `duration-fast` | 150ms | Hover, focus ring |
| `duration-normal` | 200ms | Buttons, badges |
| `duration-slow` | 300ms | Drawer, sheet |
| `stagger-kpi` | 40ms between children | Dashboard KPI row only |
| `ease-enter` | cubic-bezier(0.16, 1, 0.3, 1) | Enter |
| `ease-exit` | cubic-bezier(0.4, 0, 1, 1) | Exit |

## Build plan

1. Run creative-design + frontend-design planning pass; record palette and type in `docs/design/tokens.md` (AC-3, AC-4)
2. Initialize shadcn and CSS variables (AC-3)
3. Build responsive app shell and mobile sheet (AC-1, AC-8)
4. Build feedback components with motion fallbacks (AC-2, AC-7)
5. Author `docs/design/motion.md` and shared motion helpers (AC-6, AC-7)
6. Run web-design-guidelines on shell and table primitives (AC-5)

## Consequences

Adds `motion` dependency; keep bundle impact in mind via targeted imports.

## Follow-up

**Always before shipping UI changes:** invoke `using-superpowers`, then apply **`creative-design`** (brand and visual story), then **`frontend-design`** (layout, type, motion discipline), then audit with **`web-design-guidelines`**. Revisit this chain on dashboard and orders slices, not only this foundation task.
