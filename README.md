# Analytics Dashboard

Production style SaaS analytics dashboard built with Next.js App Router, TypeScript, Tailwind CSS v4, and shadcn/ui. Data is served from versioned JSON seed files through Route Handlers; the UI never imports seed files directly.

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is busy, use `pnpm dev --port 3010`.

Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Production

```bash
pnpm build
pnpm start
```

## Demo deployment

Add your hosted URL here after deploy (Vercel is the default target from spec 0001):

`https://your-deployment.vercel.app`

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm lint` | ESLint (flat config) |
| `pnpm typecheck` | TypeScript `strict` check |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test` | Vitest unit tests |
| `pnpm seed:generate` | Regenerate `data/seed/*.json` |
| `pnpm seed:verify` | Validate seed shape |

## Folder structure

```text
app/
  (dashboard)/          # Shell routes: /, /orders
  api/                  # Route Handlers (mock REST API)
components/
  ui/                   # shadcn primitives (base-nova)
  layout/               # App shell, providers, motion
  dashboard/            # KPIs, charts, activity feed
  orders/               # Filters, table, detail sheet
  feedback/             # Empty, error, skeleton states
data/seed/              # customers.json, orders.json, activities.json
lib/
  api/                  # Client fetch wrappers (UI calls these)
  server/               # Seed load, queries, analytics (server only)
  dashboard/            # Dashboard page data composition
  orders/               # URL search param helpers
  format/               # currency, percent, deltas, relative time
  motion/               # Motion tokens + reduced-motion hook
docs/                   # Scope, specs, architecture, design tokens
```

## Data fetching and layering

```text
data/seed/*.json
  → lib/server (Zod parse, in-memory queries)
  → app/api/* (HTTP boundary)
  → lib/api/* (fetchJson from Server Components or Client islands)
  → UI
```

- **Server Components** (`app/(dashboard)/**/page.tsx`): load initial data on the server via `lib/api/*` (which calls same-origin Route Handlers) or compose helpers like `lib/dashboard/get-dashboard-data.ts`.
- **Client islands** (`"use client"`): charts (Recharts), motion, orders filters/table/sheet. They call `lib/api/*` only, never `data/seed/*`.
- **Orders URL state**: filters and pagination sync to the query string (`q`, `status`, `from`, `to`, `page`). The server renders the first page from `searchParams`; the client skips a duplicate fetch when the query matches that server payload, then refetches when filters change.

**Conversion rate (KPI):** `paid / (paid + cancelled + pending)` for orders in the selected date range (default last 30 days on the dashboard).

## Server vs Client

| Area | Mode | Notes |
| --- | --- | --- |
| Dashboard and orders page shells | Server | Data fetch, static layout |
| KPI stagger, charts, toasts | Client | `motion`, Recharts |
| Orders filters, pagination, sheet | Client | Debounced search, URL sync |
| `app/api/**` | Server | Reads seed via `lib/server/data` |

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Responsive UX

Breakpoints follow Tailwind defaults (`sm` 640, `md` 768, `lg` 1024). The app shell uses a fixed sidebar from `lg` up and a sheet drawer below `lg`. The dashboard KPI grid is 1 / 2 / 4 columns; orders filter toolbar stacks below `md`; wide tables scroll horizontally with a sticky first column on orders.

Full rules: [docs/scope/scope.md](docs/scope/scope.md) (Design and UX standards).

## Motion and performance

- **Motion:** `motion` for KPI stagger and chart enter; sheet uses CSS transitions (~250ms). Tokens in [docs/design/motion.md](docs/design/motion.md). `prefers-reduced-motion` disables stagger via `lib/motion/use-prefers-reduced-motion.ts`.
- **Charts:** Recharts inside shadcn `ChartContainer`; animate opacity/transform only.
- **Orders list:** `useMemo` builds a stable query key for fetches; debounced search (300ms) limits API calls; `useCallback` on sheet detail retry. Server passes initial list data so mount with URL filters does not double fetch.

## Mock API reference

| Endpoint | Purpose |
| --- | --- |
| `GET /api/analytics/summary` | KPIs (`from`, `to` query) |
| `GET /api/analytics/revenue` | Revenue time series (cents per day) |
| `GET /api/analytics/orders-series` | Order count per day |
| `GET /api/orders` | Paginated list (`q`, `status`, `from`, `to`, `page`, `pageSize`) |
| `GET /api/orders/[id]` | Order + customer summary |
| `GET /api/activities` | Activity feed (`limit`) |

## UI stack

- Tailwind v4: `app/globals.css`, `@theme inline`
- shadcn/ui: `components.json` (preset **base-nova**)
- Add primitives: `pnpm dlx shadcn@latest add <name>`

## Docs for reviewers

- [docs/scope/scope.md](docs/scope/scope.md) — feature scope and UX bar
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layering and conventions
- [docs/specs/](docs/specs/) — decision records (0001–0005)
- [docs/design/tokens.md](docs/design/tokens.md) · [docs/design/motion.md](docs/design/motion.md)

## Agent context

See [AGENTS.md](AGENTS.md) for coding standards and skill chain for UI work.
