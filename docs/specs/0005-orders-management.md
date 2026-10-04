# 0005. Orders management page

**Date**: 2026-10-04
**Status**: Accepted

## Summary

Orders list with search, status filter, date range, pagination, and order detail in a sheet or drawer. Filter state synced to URL query string. Client island inside server page shell. Filters stack on small screens; detail panel animates per spec 0003.

## Requirements

**Acceptance criteria**:

- **AC-1**: `/orders` lists orders with columns id, customer, amount, status, date.
- **AC-2**: Search debounced; queries `q` param on API.
- **AC-3**: Status filter and date range filter combine; URL reflects all filters.
- **AC-4**: Pagination controls update `page` without losing filters.
- **AC-5**: Order detail shows line items and customer summary in animated sheet or drawer (250 to 300ms).
- **AC-6**: Empty filter result shows EmptyState; API error shows ErrorState with retry.
- **AC-7**: No duplicate fetch on mount when URL already contains filters (single request per stable query key).
- **AC-8**: Filter toolbar stacks vertically below `md`; table scrolls horizontally with sticky first column on small screens if card layout is not used.

## Build plan

1. Server page shell + searchParams pass through (AC-1)
2. Client filters + table with `useMemo` for derived query string (AC-2, AC-3, AC-7, AC-8)
3. Pagination component (AC-4)
4. Animated detail sheet (AC-5)
5. Empty and error UX (AC-6)

## Follow-up

**Always before merge:** `using-superpowers` → **`creative-design`** → **`frontend-design`** → **`web-design-guidelines`** on `components/orders/**`.

Document `useCallback` / `useMemo` / `memo` choices in README performance section.
