# 0004. Dashboard overview page

**Date**: 2026-10-04
**Status**: Accepted

## Summary

Server rendered dashboard route with four KPI cards, two charts (revenue over time, orders over time), a recent orders table (5 rows), and a system activity list. Each section uses shared feedback components and loads data through `lib/api` or server loaders per spec 0001. Motion: KPI stagger on first paint, chart fade in after skeleton, per scope motion rules.

## Requirements

**Acceptance criteria**:

- **AC-1**: Route `/` (or `/dashboard`) shows revenue, orders count, active customers, conversion rate with prior period delta when seed supports it.
- **AC-2**: Revenue chart and orders chart render with accessible tooltips and responsive height (240px mobile, 320px desktop minimum).
- **AC-3**: Recent orders table links to order detail or orders list filtered by id.
- **AC-4**: Activities list shows at least type, message, relative time.
- **AC-5**: `loading.tsx` and error boundary or error.tsx handle failures; empty seed yields EmptyState not a crash.
- **AC-6**: KPI grid 1 / 2 / 4 columns per scope responsive table; charts full width below KPIs on all breakpoints.
- **AC-7**: KPI row uses one staggered enter (motion tokens from spec 0003); disabled when `prefers-reduced-motion`.
- **AC-8**: Skeleton to content cross fade on charts without layout shift.

## Build plan

1. Server page composes KPI data fetch (AC-1)
2. Client chart island with Recharts and enter animation (AC-2, AC-6, AC-8)
3. KPI row with stagger wrapper (AC-7)
4. Recent orders + activities sections (AC-3, AC-4)
5. Wire skeleton and error states (AC-5)

## Follow-up

**Always before merge:** `using-superpowers` → **`creative-design`** (dashboard feels like a credible ops product) → **`frontend-design`** (avoid generic card grid clichés) → **`web-design-guidelines`** on `app/**/page.tsx` and `components/dashboard/**`.

Compare period deltas in KPI subtitles for evaluator polish.
