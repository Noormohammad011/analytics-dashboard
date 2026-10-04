# 0006. Console sidebar and visual polish

**Date**: 2026-10-04
**Status**: In Progress

## Summary

Refresh Pulseboard so it reads like a modern operator console, aligned with the SELISE style reference the team shared. The left sidebar gets grouped workspace and environment chrome, a clear active nav rail, and a polished icon rail when collapsed. Loading states use one shared shimmer skeleton pattern. Status badges use soft semantic colors across orders, dashboard KPIs, and activity.

## Context

Specs 0003 and 0005 established a working shadcn shell, feedback primitives, and orders UI. Evaluators and operators still see a generic analytics template: flat outline badges, basic pulse skeleton bars, and a single "Navigation" group without the hierarchy seen in production consoles. Feature 8 in scope asks for parity with a reference layout (section labels, env pill, accent active state, colorful status chips) without changing backend or data contracts. This is an enhancement to existing components, not a new product surface.

## Requirements

**User stories**:

- As an operator, I want the sidebar to show where I am in the product (workspace, environment, active page) so navigation feels like a real console.
- As an operator, I want order and activity status at a glance via color so I do not read every label.
- As an operator, I want loading states that feel deliberate so I trust the app while data fetches.

**Acceptance criteria**:

- **AC-1**: `app-shell.tsx` sidebar shows at least three labeled groups: **Workspace** (brand block), **Project** (primary nav: Dashboard, Orders), **Environment** (compact pill, e.g. `Seed` or `Mock API`, plus optional subtitle). Group labels use uppercase muted style per reference.
- **AC-2**: Active nav item shows a left accent rail (2 to 3px primary), tinted row background, and primary tinted icon or text; inactive items stay muted. Behavior matches on desktop sidebar and mobile sheet (same structure).
- **AC-3**: Desktop keeps a full width sidebar (no icon rail). `collapsible="offcanvas"` may slide the sidebar off canvas when toggled; product default is sidebar open with no desktop toggle. Below `lg`, navigation opens in a sheet from the hamburger control; sheet repeats the same groups (Workspace, Project, Environment).
- **AC-4**: `components/ui/badge.tsx` adds semantic variants (or a thin `StatusBadge` wrapper) mapped from domain: order statuses (`paid`, `pending`, `shipped`, `cancelled`, `refunded`), customer status, activity type, KPI delta tone (`positive`, `negative`, `neutral`). Colors are soft fills (e.g. green success, amber warning, blue info, red destructive, gray neutral), not outline only for status chips.
- **AC-5**: `lib/format/status-badge.ts` (or equivalent) centralizes order status to variant mapping; orders table, recent orders, and order detail sheet use it (no duplicated switch per file).
- **AC-6**: `Skeleton` or `DataSkeleton` uses a subtle shimmer gradient animation on `bg-muted` with `prefers-reduced-motion: reduce` falling back to static pulse or no animation. Dashboard `loading.tsx`, orders client fetch, and order detail sheet loading use the same pattern.
- **AC-7**: Optional inline list loading: table body shows 3 to 5 skeleton rows shaped like real rows (not full page replace only) when orders refetch; reduced motion respected.
- **AC-8**: Skill chain documented in Follow-up runs on changed UI files before merge; no regression to URL filter behavior or sheet open on row click.

## Options considered

### Option 1: Extend shell and tokens in place (recommended)

Adjust `app-shell`, sidebar menu button classes, badge variants, and feedback skeletons. Add one status mapping helper. No new routes or dependencies.

**Pros**:

- Smallest diff, matches Tracer Bullet widen approach.
- Reuses shadcn Sidebar and Badge.

**Cons**:

- Sidebar component may need targeted class overrides in `sidebar.tsx` or shell only.

### Option 2: Replace Sidebar with custom layout

Rebuild nav outside shadcn Sidebar.

**Pros**:

- Pixel perfect control.

**Cons**:

- High regression risk on mobile sheet and collapse; duplicates 0003 work.

### Option 3: Third party loading library

Add a dedicated skeleton library.

**Pros**:

- Fancy presets.

**Cons**:

- Violates minimal dependency rule; CSS shimmer is enough.

## Decision

**Chosen option**: Option 1: Extend shell and tokens in place.

Keep shadcn Sidebar, Popover, and Badge; enhance styling and shared helpers only. Reference console screenshots from the product discussion (grouped sidebar, env pill, verified style green badge) are the visual target; Pulseboard branding stays (Pulseboard wordmark, mock API honesty).

**Implementation skills**: `creative-design` (`.cursor/skills/creative-design/`) · `frontend-design` (`.cursor/skills/frontend-design/`) · `web-design-guidelines` (`.cursor/skills/web-design-guidelines/`) · `composition-patterns` (`.cursor/skills/composition-patterns/`)

## Rationale

The gap is visual hierarchy and semantic color, not architecture. Option 1 delivers scope feature 8 with the lowest blast radius and aligns with spec 0003 motion rules (shimmer with reduced motion fallback). Option 2 is unjustified for a polish slice. Option 3 adds bundle weight without a clear win.

## Feature design

**Component inventory (changes)**:

| Area | Files |
| --- | --- |
| Shell | `components/layout/app-shell.tsx`, optional `components/layout/sidebar-console.tsx` if shell grows |
| Sidebar styling | `components/ui/sidebar.tsx` (active rail classes via `data-active` or `sidebarMenuButtonVariants`) |
| Badges | `components/ui/badge.tsx`, `components/orders/order-status-badge.tsx` or `lib/format/status-badge.ts` |
| Consumers | `orders-data-table.tsx`, `recent-orders-table.tsx`, `order-detail-sheet.tsx`, `activity-feed.tsx`, `kpi-card.tsx` |
| Loading | `components/ui/skeleton.tsx`, `components/feedback/data-skeleton.tsx`, `components/feedback/table-rows-skeleton.tsx` (new, optional), `app/(dashboard)/loading.tsx`, `orders-view.tsx` |

**Sidebar structure (desktop and mobile sheet)**:

```
[Logo + Pulseboard]
── WORKSPACE ──
── PROJECT ──
  Dashboard (icon)
  Orders (icon)
── ENVIRONMENT ──
  [Seed] pill
  subtitle text
```

**Badge mapping (order status)**:

| Status | Visual intent |
| --- | --- |
| paid | success (soft green) |
| shipped | info (soft blue) |
| pending | warning (soft amber) |
| cancelled | destructive (soft red) |
| refunded | neutral (soft gray purple or muted) |

**Value sourcing**:

| UI value | Source |
| --- | --- |
| Order status label | `order.status` from API |
| Badge color variant | `getOrderStatusBadgeVariant(order.status)` in shared helper |
| Environment pill label | Static copy `Seed` or `Mock API` (no live env) |
| Active nav item | `usePathname()` vs `navItems[].href` |
| KPI delta badge variant | `formatDeltaPercent` tone → semantic badge variant |
| Activity type badge | `activity.type` → mapped variant table |

**Key invariants**:

- No change to API shapes or filter URL keys.
- Accessibility: active state not color only (rail + `aria-current` on active link where supported).
- `prefers-reduced-motion` disables shimmer stagger.

**Security model**: N/A (presentation only).

## Build plan

1. Run creative-design + frontend-design pass; capture sidebar and badge tokens in `docs/design/tokens.md` supplement or inline comments (AC-1, AC-4)
2. Restructure `app-shell` sidebar groups, env pill, active rail styling (AC-1, AC-2, AC-3)
3. Add semantic badge variants + `getOrderStatusBadgeVariant` and wire orders + dashboard consumers (AC-4, AC-5)
4. Implement shimmer skeleton + `DataSkeleton` / optional table row skeleton; wire dashboard loading, orders refetch, detail sheet (AC-6, AC-7)
5. web-design-guidelines pass on touched files; verify mobile sheet parity (AC-2, AC-8)

## Migration plan

**Strategy**: no migration needed (UI only, in place).

**Phases**: single deployable PR.

**Rollback**: revert commit.

**Risks**: sidebar class changes affect collapse tooltips; test `lg` and mobile sheet.

## Critical test scenarios

| Scenario | AC |
| --- | --- |
| Desktop: active Orders shows rail + tint; Dashboard inactive | AC-2 |
| Mobile sheet: same groups and active state | AC-2 |
| Below lg: hamburger opens sheet with same sidebar groups | AC-3 |
| Each order status renders distinct soft color | AC-4, AC-5 |
| Orders filter fetch shows row skeletons, then data | AC-6, AC-7 |
| `prefers-reduced-motion` reduces animation | AC-6 |

## Consequences

Slightly more CSS in shell and badge variants; status colors must stay readable in light mode (WCAG AA for text on soft fills). Future dark mode should reuse same variant names.

## Follow-up

**Before merge:** `using-superpowers` → **creative-design** → **frontend-design** → **web-design-guidelines** on `components/layout/**`, `components/feedback/**`, `components/orders/**`, `components/dashboard/**`.

Consider documenting status color map in `docs/design/tokens.md` for evaluators.

## References

- Scope feature 8: `docs/scope/scope.md`
- Prior art: spec [0003](0003-design-system-ui-foundation.md)
- Visual reference: operator console screenshots (SELISE style), shared in product discussion Oct 2026
- shadcn Sidebar patterns: project `components/ui/sidebar.tsx`
