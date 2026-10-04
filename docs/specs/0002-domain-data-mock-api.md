# 0002. Domain data model and mock API layer

**Date**: 2026-10-04
**Status**: Accepted

## Summary

Define customers, orders, and system activities as typed domain models backed by JSON seed files. Expose them through Next.js Route Handlers with query parameters for orders list filters. A `lib/api` module is the only surface UI uses to load data. Aggregations for dashboard KPIs and chart series live in server only code so UI never sums raw rows ad hoc.

## Context

The evaluation explicitly forbids hardcoding metrics inside components. Centralizing seed access and aggregation prevents drift between dashboard totals and orders table. Mock data should look realistic: varied order statuses, timestamps over the last 90 days, and activity events tied to orders and customers.

## Requirements

**User stories**:

- As a dashboard user, I want accurate totals and trends so that KPIs match underlying orders.
- As a developer, I want Zod or manual guards at the API boundary so malformed seed edits fail loudly in development.

**Acceptance criteria**:

- **AC-1**: Types `Customer`, `Order`, `Activity`, `AnalyticsSummary`, `TimeSeriesPoint` exist in `lib/types`.
- **AC-2**: Seed files include at least 50 orders, 20 customers, 30 activities; ISO 8601 dates; `OrderStatus` enum.
- **AC-3**: `GET /api/orders` supports `q`, `status`, `from`, `to`, `page`, `pageSize` and returns `{ items, total, page, pageSize }`.
- **AC-4**: `GET /api/orders/[id]` returns 404 JSON when missing.
- **AC-5**: `GET /api/analytics/summary` returns revenue, orderCount, activeCustomers, conversionRate with documented formulas.
- **AC-6**: `GET /api/analytics/revenue` and `GET /api/analytics/orders-series` return time series for charts (default last 30 days).
- **AC-7**: `GET /api/activities` returns recent activities sorted by `createdAt` desc with limit.
- **AC-8**: `lib/api` functions mirror endpoints and throw typed errors for non OK responses.

## Options considered

### Option 1: Flat JSON files + in memory query

**Pros**: Simplest; no code generation.

**Cons**: Reload on each request unless cached module scope.

### Option 2: Generated SQLite from seed

**Pros**: Real SQL for filters.

**Cons**: Heavier than brief requires.

## Decision

**Chosen option**: Option 1 with module scoped cache of parsed JSON in development and production.

## Feature design

**Data model sketch**:

| Entity | Key fields | Notes |
| --- | --- | --- |
| Customer | `id`, `name`, `email`, `createdAt`, `status` (`active` \| `churned`) | `active` if order in last 60 days |
| Order | `id`, `customerId`, `amountCents`, `currency`, `status`, `createdAt`, `lineItems[]` | status: `pending`, `paid`, `shipped`, `cancelled`, `refunded` |
| Activity | `id`, `type`, `message`, `createdAt`, `metadata` | types: `order_created`, `payment_failed`, `shipment`, `system` |

Relationships: Customer 1:N Order; Activity optionally references `orderId` / `customerId` in metadata.

**State transitions** (Order): `pending` → `paid` → `shipped`; `pending` → `cancelled`; `paid` → `refunded` (terminal states enforced in seed only for mock).

**API surface**:

| Endpoint | Method | Key inputs | Key outputs | Auth | Key errors |
| --- | --- | --- | --- | --- | --- |
| /api/analytics/summary | GET | optional `from`, `to` | KPI DTO | none | 500 |
| /api/analytics/revenue | GET | `from`, `to`, `granularity` | `{ points: TimeSeriesPoint[] }` | none | 400 |
| /api/analytics/orders-series | GET | `from`, `to` | series | none | 400 |
| /api/orders | GET | `q`, `status`, `from`, `to`, `page`, `pageSize` | paginated list | none | 400 |
| /api/orders/[id] | GET | id path | Order + Customer summary | none | 404 |
| /api/activities | GET | `limit` | Activity[] | none | 400 |

**Value sourcing**:

| Action | Value | Source |
| --- | --- | --- |
| Total revenue | sum of `amountCents` for `paid` and `shipped` orders in range | derived in `lib/server/analytics.ts` from seed orders |
| Conversion rate | paid orders / unique sessions proxy: use `paid / (paid + cancelled + pending)` in range | defined in spec; implement in analytics module |
| Active customers | customers with ≥1 order in last 60 days | derived from orders + customers seed |
| Chart points | bucket by day in range | analytics module |

**Key invariants**:

- Amounts stored as integer cents.
- All API dates are UTC ISO strings; UI formats with `Intl` in presentation layer.
- Pagination: `page` ≥ 1, `pageSize` default 10 max 50.

**Security model**: Public read only mock; no PII beyond fake names and emails in seed.

**Configuration required**: none for MVP.

**Critical test scenarios**:

- Happy path: summary matches manual sum on fixture subset, verifies **AC-5**
- Failure: unknown order id returns 404, verifies **AC-4**
- Filter: status + date range reduces `total` correctly, verifies **AC-3**

## Build plan

1. Add seed JSON and TypeScript types (AC-1, AC-2)
2. Implement `lib/server/data.ts` loader with parse validation (AC-2)
3. Implement analytics aggregations (AC-5, AC-6)
4. Implement Route Handlers (AC-3, AC-4, AC-6, AC-7)
5. Implement `lib/api` client wrappers and error type (AC-8)
6. Smoke test handlers with curl or vitest route tests (AC-3, AC-5)

## Consequences

- Conversion rate definition must match README explanation for evaluators.
- Large seed files should stay under git friendly size; generate script optional in Follow-up.

## Follow-up

**When UI consumes new fields:** run `using-superpowers` and the design skill chain from `docs/scope/scope.md` if presentation changes.

- Seed generator script `scripts/generate-seed.ts` for reproducible demo data.
