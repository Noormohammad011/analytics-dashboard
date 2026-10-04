# Scope: Production Analytics Dashboard

A SaaS style analytics dashboard for operators who manage customers, orders, and system activity. Built as a frontend engineering showcase: mock API, clear layering, responsive UI, purposeful motion, and submission ready documentation.

**Build approach:** Tracer Bullet (thin end to end thread from seed data through API routes and service layer into UI, then widen each slice).
**Workflow:** Beta (after `/develop`, run `/check verify` then `/test`). Spec first for load bearing decisions; `/architect` is the default gate when a feature needs one.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit._

## Design and UX standards (every UI slice)

Apply on **every** feature that ships UI (foundation design system, dashboard, orders). This is the bar evaluators see on responsive UX and polish.

### Skill chain (using superpowers)

Before you design or build UI, run the skill check from `using-superpowers` (user install). For this project the usual chain is:

1. **`creative-design`** (`/.cursor/skills/creative-design/`) for brand tone, visual story, and emotional clarity (credible operator tool, not a generic template).
2. **`frontend-design`** (`.cursor/skills/frontend-design/`) for distinctive typography, color, layout, and motion discipline on top of that direction.
3. **`web-design-guidelines`** on changed UI files before you call a slice done.

Each linked spec **`## Follow-up`** section repeats this chain so `/develop` does not skip it.

### Responsive rules

| Rule             | Target                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| Breakpoints      | Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px                                         |
| App shell        | Sidebar fixed from `lg` up; below `lg`, hamburger opens a sheet or drawer overlay; main content full width  |
| KPI grid         | 1 column on xs, 2 on `sm`, 4 on `lg`                                                                        |
| Charts           | Min height 240px mobile, 320px desktop; legend wraps; tooltips stay on screen                               |
| Tables           | Horizontal scroll with sticky first column on small screens, or card rows below `md` if table is unreadable |
| Filters (orders) | Stack vertically below `md`; primary actions remain visible without horizontal scroll                       |
| Touch            | Interactive targets at least 44px where platform allows; no hover only critical actions                     |
| Typography       | Body 14 to 16px; KPI values use tabular figures; no clipped text in cards                                   |
| Zoom             | Layout usable at 200% zoom without losing nav or filters                                                    |

Verify at `sm`, `md`, and `lg` widths before you mark a UI feature done.

### Motion and animation rules

| Rule           | Target                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Library        | `motion` (Framer Motion for React) for layout and enter transitions; CSS transitions for hover and focus only where motion is overkill |
| Duration       | UI feedback 150 to 200ms; panel or drawer 250 to 300ms; never above 400ms for routine UI                                               |
| Easing         | `ease-out` for enter, `ease-in` for exit; spring only for drag or playful moments (sparingly)                                          |
| Page load      | One orchestrated stagger on dashboard KPI row (not every card on the site); charts fade in after skeleton                              |
| User driven    | Drawer, sheet, filter panel, and toast use motion that shows what changed                                                              |
| Loading        | Skeleton shimmer or pulse; cross fade from skeleton to content                                                                         |
| Reduced motion | Honor `prefers-reduced-motion`: disable stagger and large transitions; keep opacity or instant swap                                    |
| Performance    | Animate `transform` and `opacity` only; avoid animating width or height on large tables                                                |
| Charts         | Optional subtle draw in on first mount; disable if reduced motion                                                                      |

Motion tokens live in spec 0003 (`docs/design/motion.md` or spec section).

## At a glance

| #   | Feature                               | Phase      | Status |
| --- | ------------------------------------- | ---------- | ------ |
| 1   | Stack & platform architecture         | Foundation | done   |
| 2   | Coding standards & tooling            | Foundation | done   |
| 3   | Domain data model & mock API          | Foundation | done   |
| 4   | Design system, motion & UI foundation | Foundation | done   |
| 5   | Dashboard overview                    | Slice 1    | done   |
| 6   | Orders management                     | Slice 2    | done   |
| 7   | Submission documentation              | Slice 3    | done   |

## Foundations

### 1. Stack & platform architecture · done

Choose Next.js App Router, TypeScript, Tailwind, charting, and mock data strategy (no Supabase for MVP; assignment expects JSON or mock API).
**Done when:** spec records the stack, folder layout, Server vs Client split, and hosting story; scaffold boots locally.

- [x] Decide the stack (spec): `/architect stack & platform architecture`
- [x] Scaffold from the decision: `/develop stack & platform architecture`
      Spec 0001 · code in `./`

### 2. Coding standards & tooling · done

Capture lint, format, and TypeScript strictness after scaffold.
**Done when:** root `AGENTS.md` matches the repo and lint/format pass clean.

- [x] Capture conventions + tooling choices: `/audit` (optional; Husky + lint-staged + commit rules in `AGENTS.md`)
- [x] Install the tooling: `/develop coding standards & tooling`
      Prettier + `format` / `format:check` / `typecheck` scripts · `eslint.config.mjs` · code in repo root config files

### 3. Domain data model & mock API · done

Entities for customers, orders, activities, and analytics aggregates; versioned seed JSON; Route Handlers as the HTTP boundary.
**Done when:** types and seed data exist; service layer fetches via `/api/*` without UI imports of raw JSON.

- [x] Design it (spec): `/architect domain data model & mock API`
- [x] Build it: `/develop domain data model & mock API`
  - [x] Seed JSON + Zod validation (AC-1, AC-2)
  - [x] Analytics + orders + activities routes (AC-3..AC-7)
  - [x] `lib/api` client wrappers (AC-8)
        Spec 0002 · code in `data/seed/`, `lib/server/`, `lib/api/`, `app/api/`

### 4. Design system, motion & UI foundation · done

Layout shell, tokens, shadcn primitives, chart and table patterns, feedback components, motion tokens, and responsive shell behavior per **Design and UX standards** above.
**Done when:** tokens and motion doc exist; shell passes responsive checks; `prefers-reduced-motion` respected on shared primitives.

- [x] Design it (spec): `/architect design system & UI foundation`
- [x] Build it: `/develop design system & UI foundation`
  - [x] Tokens + motion docs (`docs/design/`)
  - [x] Feedback + layout + KPI/chart primitives
  - [x] Motion provider + KPI stagger
        Spec 0003 · code in `components/`, `lib/motion/`, `docs/design/`

## Slice 1: Dashboard overview

### 5. Dashboard overview · done

KPI row, revenue and orders charts, recent orders, activity feed; skeleton, empty, error; KPI stagger and chart enter per motion rules.
**Done when:** dashboard loads via service layer; responsive and motion rules verified; skill chain run before merge.

- [x] Design it (spec): `/architect dashboard overview`
- [x] Build it: `/develop dashboard overview`
  - [x] Server loader + KPI deltas (AC-1)
  - [x] Charts + KPI grid + motion (AC-2, AC-6..AC-8)
  - [x] Recent orders + activity feed (AC-3, AC-4)
  - [x] loading.tsx + error.tsx (AC-5)
        Spec 0004 · code in `app/(dashboard)/page.tsx`, `lib/dashboard/`, `components/dashboard/`

## Slice 2: Orders management

### 6. Orders management · done

Orders list with search, status filter, date range, pagination; animated drawer or sheet for detail; filters stack on small screens.
**Done when:** filters in URL without duplicate fetches; responsive and motion rules verified; skill chain run before merge.

- [x] Design it (spec): `/architect orders management`
- [x] Build it: `/develop orders management`
  - [x] Server shell + URL params (AC-1, AC-3)
  - [x] Debounced search + filters + table (AC-2, AC-7, AC-8)
  - [x] Pagination (AC-4)
  - [x] Detail sheet (AC-5)
  - [x] Empty + error states (AC-6)
        Spec 0005 · code in `app/(dashboard)/orders/`, `components/orders/`, `lib/orders/`

## Slice 3: Submission documentation

### 7. Submission documentation · done

README, architecture notes, Server vs Client explanation, performance and motion notes for evaluators.
**Done when:** README covers setup, folder structure, data fetching, responsive and motion decisions, and demo link if deployed.

- [x] Build it: `/develop submission documentation`
- [ ] Verify it: `/check verify submission documentation`
- [x] Test it: `/test submission documentation`
      README.md · docs/ARCHITECTURE.md · Vitest suite for core `lib/` logic

## Deferred

Out of scope for this pass; kept for honesty.

- **Authentication & roles**: no login in the assignment brief
- **Supabase or live Postgres**: optional stretch; mock API satisfies requirements
- **Real time activity stream**: static or polled mock data only
- **Customer CRUD page**: not required in the brief
- **Product analytics (PostHog, etc.)**: not required

## Legend

See `scope-template.md` in the scope skill for lifecycle and checkbox rules. **Design and UX standards** apply to features 4, 5, and 6 unless explicitly deferred.
