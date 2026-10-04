# Architecture

**Interactive diagram:** [architecture/pulseboard-architecture.html](architecture/pulseboard-architecture.html) (source: [pulseboard.architecture.json](architecture/pulseboard.architecture.json)).

## Data flow

```text
data/seed/*.json → lib/server (parse, aggregate) → app/api/* → lib/api (fetch) → Server pages / Client islands
```

Seed files are loaded once per request path through `lib/server/data.ts` (cached in memory for the process). Zod schemas in `lib/server/schemas.ts` validate shape at load time.

## Server vs Client Components

| Area | Default | Notes |
| --- | --- | --- |
| `app/**/layout.tsx`, `page.tsx` shells | Server | Compose data via `lib/api` or `lib/dashboard/*` |
| Charts (`recharts`) | Client | `"use client"` chart islands |
| Orders filters, table, sheet | Client | URL driven state; `lib/api/orders` |
| Route Handlers `app/api/**` | Server | Call `lib/server/*` only |
| `loading.tsx`, `error.tsx` | Server | Route level feedback |

**Rule:** no UI module imports JSON from `data/seed/`. Only `lib/server` and Route Handlers touch seed files.

## Key modules

| Module | Role |
| --- | --- |
| `lib/server/orders-query.ts` | Search, filter, paginate orders in memory |
| `lib/server/analytics.ts` | KPI summary and time series bucketing |
| `lib/api/http.ts` | Same origin `fetchJson` for server and browser |
| `lib/dashboard/get-dashboard-data.ts` | Parallel API calls for `/` |
| `lib/orders/search-params.ts` | Parse and serialize orders URL filters |

## Performance habits

- **Server first:** dashboard and orders first paint use server fetched data; client refetch only when the user changes filters (orders skip duplicate mount when URL matches server query key).
- **Memoization:** stable `queryKey` strings for orders list effects; chart config objects memoized in chart components.
- **Motion:** prefer `transform` and `opacity`; honor `prefers-reduced-motion` for stagger (see `docs/design/motion.md`).
- **No seed in client bundles:** keeps client JS smaller and forces a real API boundary.

## Deployment

Target: Vercel or any Node host running `next start`. Optional `NEXT_PUBLIC_SITE_URL` for absolute fetches during SSR when not on Vercel.

## Related specs

Stack and folder layout: `docs/specs/0001-platform-stack.md`. Mock API: `0002`. UI foundation: `0003`. Dashboard: `0004`. Orders: `0005`. Console shell polish: `0006`.
