# 0001. Adopt Next.js mock API platform for the analytics dashboard

**Date**: 2026-10-04
**Status**: Accepted

## Summary

This project is a frontend focused SaaS analytics dashboard for a take home style evaluation. We use Next.js 15 App Router with TypeScript and Tailwind CSS. Data comes from versioned JSON seed files exposed through Route Handlers, with a dedicated service layer between UI and HTTP. We do not use Supabase or another database for the MVP because the brief asks for a JSON dataset or mock API and rewards clear separation of concerns over operational backend setup. Charts use Recharts; UI primitives use shadcn/ui on Radix. Hosting target is Vercel or any Node host that runs `next start`.

## Context

The evaluator cares about React and Next.js architecture, API layering, reusable components, performance habits, responsive UX, and whether you can explain your choices. A headless BaaS such as Supabase is valid for a real product, but it adds auth, schema, and env setup that the brief does not require and can distract from the frontend story. A mock API inside the same Next.js app keeps deployment simple, keeps types aligned with seed data, and still forces you to treat data as remote (loading, errors, empty lists, unexpected shapes).

The app is read heavy: dashboards, charts, filtered tables. There is no multi tenant auth in scope. Scale is demo data (hundreds to low thousands of rows). The team size is one developer with AI assistance.

## Requirements

**User stories**:

- As an evaluator, I want a runnable repo with one command install and dev server so that I can review the UI quickly.
- As a developer, I want UI components free of embedded seed literals so that data fetching and transformation stay testable.
- As a developer, I want Server Components by default and Client Components only for interactivity so that the architecture matches App Router guidance.

**Acceptance criteria**:

- **AC-1**: `package.json` scripts include `dev`, `build`, and `start`; `next build` succeeds on a clean clone after install.
- **AC-2**: Folder layout separates `app/` routes, `components/`, `lib/` (services, types, utils), and `data/` or `lib/mock/` seed JSON.
- **AC-3**: No UI file imports seed JSON directly; only Route Handlers or server only modules read seed files.
- **AC-4**: Documented rule for Server vs Client: pages and static shells are Server Components; filters, charts, and interactive tables are Client Components with props from server or client fetch via service layer.
- **AC-5**: Environment variables are limited to public site URL if needed; no secret backend keys for MVP.

## Options considered

### Option 1: Next.js Route Handlers + JSON seed (monolith)

Seed files in repo; `app/api/**` implements REST shaped endpoints; `lib/api/*` wraps `fetch` for client islands and direct imports for server.

**Pros**:

- Matches assignment wording; one repo; easy Vercel deploy; clear service layer story.

**Cons**:

- Not a realistic production data plane; pagination and search are in memory.

### Option 2: Supabase Postgres + generated types

Real database, SQL seed scripts, Supabase client in service layer.

**Pros**:

- Demonstrates BaaS fluency; closer to production persistence.

**Cons**:

- Extra setup for reviewers; auth and RLS out of scope; slower to hit “working dashboard” for a frontend rubric.

### Option 3: MSW or json-server separate process

External mock server or browser MSW.

**Pros**:

- Very close to “real” HTTP in development.

**Cons**:

- Two processes or test only mocking; README friction; still not production data.

## Decision

**Chosen option**: Option 1: Next.js Route Handlers + JSON seed (monolith)

**Implementation skills**: `react-best-practices` (vercel-labs/agent-skills, `.cursor/skills/react-best-practices/`) · `composition-patterns` (vercel-labs/agent-skills, `.cursor/skills/composition-patterns/`) · `frontend-design` (anthropics/skills, `.cursor/skills/frontend-design/`) · `web-design-guidelines` (vercel-labs/agent-skills, `.cursor/skills/web-design-guidelines/`)

## Rationale

Option 1 optimizes for the rubric: API service layer, types, transformations, and UI states without operational noise. Supabase remains a credible follow up if you extend the portfolio piece, but it is deferred. MSW is better as a test adjunct than as the primary data plane for this repo.

## Proposed stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Language | TypeScript (strict) | Assignment requirement; shared types across API and UI |
| Framework | Next.js 15 App Router | Assignment requirement; Server Components for dashboard shell |
| Styling | Tailwind CSS v4 (or v3 if scaffold pins v3) | Assignment requirement; pairs with shadcn |
| UI primitives | shadcn/ui + Radix | Accessible tables, dialogs, selects for filters |
| Charts | Recharts | Common in dashboards; works in Client Components |
| Data | JSON seed + Route Handlers | Meets mock API requirement; no external DB |
| Auth | None (MVP) | Out of scope in brief |
| State (filters) | URL search params + `useSearchParams` / nuqs optional | Shareable order filters; avoids global store |
| Motion | `motion` (Framer Motion for React) | Enter transitions, drawer, KPI stagger; see spec 0003 |
| Hosting | Vercel | Zero config for Next.js demo |
| Observability | `console` + optional Sentry later | Not required for MVP |

## Folder structure (target)

```text
app/
  (dashboard)/
    page.tsx              # Dashboard overview (Server)
    orders/
      page.tsx            # Orders list (Server shell + Client island)
      [id]/page.tsx       # Order detail (optional)
  api/
    analytics/summary/route.ts
    analytics/revenue/route.ts
    analytics/orders-series/route.ts
    orders/route.ts
    orders/[id]/route.ts
    activities/route.ts
components/
  ui/                     # shadcn
  dashboard/              # KPI cards, charts
  orders/                 # table, filters, detail
  layout/                 # sidebar, page header
  feedback/               # skeleton, empty, error
lib/
  api/                    # client service functions (fetch wrappers)
  server/                 # seed readers, aggregations (server only)
  types/                  # Order, Customer, Activity, Analytics DTOs
  utils/                  # format currency, dates, cn()
data/
  seed/                   # customers.json, orders.json, activities.json
```

## Server vs Client strategy

| Area | Component type | Data access |
| --- | --- | --- |
| Root layout, sidebar | Server | None or minimal |
| Dashboard page shell | Server | `lib/server` aggregations or internal fetch to Route Handlers |
| KPI cards | Server children or Client if animated | Props from parent |
| Charts | Client (`recharts` needs DOM) | Props or client fetch via `lib/api` once |
| Orders filters + table | Client island inside Server page | `lib/api` with query string; debounced search |
| Loading UI | `loading.tsx` Server | Suspense boundaries per section |

Use `useEffect` only for client side fetch when the island mounts without server props, or for debouncing search input. Prefer server fetch for dashboard first paint when possible.

## Performance decisions (document for README)

- `useMemo`: derived chart series, filtered counts, pagination slice when inputs are stable and computation is non trivial.
- `useCallback`: handlers passed to memoized table rows or chart children.
- `React.memo`: table row component when parent re-renders on filter typing.
- Avoid duplicate fetches: stabilize filter object in URL; single `useEffect` dependency array keyed on serialized filters; server pages do not refetch on client navigation if data passed as props.
- Dynamic import heavy chart module with `next/dynamic` if bundle size matters.
- Direct icon imports, no barrel files that pull entire libraries.

## Consequences

- Search and pagination are in memory over seed data; document complexity as O(n) acceptable for demo size.
- No real auth; do not imply row level security in copy.
- Switching to Supabase later means replacing `lib/server` readers and Route Handler internals, keeping `lib/api` shapes stable.

## Follow-up

**Always for UI work:** invoke `using-superpowers`, then **`creative-design`**, then **`frontend-design`**, then **`web-design-guidelines`** on touched components (see `docs/scope/scope.md` Design and UX standards).

- Optional Phase 2: Supabase tables mirroring seed schema for portfolio extension.
- Add Playwright smoke tests for dashboard and orders filters (Beta workflow).
- Document responsive breakpoints and motion policy in README (ties to scope standards).

## Rationale pointer

Decision record sections above are inline; no separate `rationale.md` for this single file spec.
