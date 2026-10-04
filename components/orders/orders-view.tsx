"use client"

import * as React from "react"

import { EmptyState } from "@/components/feedback/empty-state"
import { ErrorState } from "@/components/feedback/error-state"
import { DataSkeleton } from "@/components/feedback/data-skeleton"
import { OrderDetailSheet } from "@/components/orders/order-detail-sheet"
import { OrdersDataTable } from "@/components/orders/orders-data-table"
import { OrdersFilters } from "@/components/orders/orders-filters"
import { OrdersPagination } from "@/components/orders/orders-pagination"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getOrders } from "@/lib/api/orders"
import { ApiError } from "@/lib/api/http"
import {
  buildOrdersQueryKey,
  type OrdersPageParams,
  syncOrdersUrl,
} from "@/lib/orders/search-params"
import type { PaginatedOrders } from "@/lib/types"

type OrdersViewProps = {
  initialData: PaginatedOrders
  initialParams: OrdersPageParams
  initialQueryKey: string
}

const toFilterValues = (params: OrdersPageParams) => ({
  q: params.q ?? "",
  status: params.status ?? ("all" as const),
  from: params.from ?? "",
  to: params.to ?? "",
})

const paramsFromFilters = (
  filters: ReturnType<typeof toFilterValues>,
  page: number,
  pageSize: number,
): OrdersPageParams => ({
  q: filters.q.trim() || undefined,
  status: filters.status === "all" ? undefined : filters.status,
  from: filters.from || undefined,
  to: filters.to || undefined,
  page,
  pageSize,
})

export const OrdersView = ({
  initialData,
  initialParams,
  initialQueryKey,
}: OrdersViewProps) => {
  const [searchInput, setSearchInput] = React.useState(initialParams.q ?? "")
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [filters, setFilters] = React.useState(() => toFilterValues(initialParams))
  const [page, setPage] = React.useState(initialParams.page)
  const [data, setData] = React.useState(initialData)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const requestParams = React.useMemo(
    () =>
      paramsFromFilters(
        { ...filters, q: debouncedSearch },
        page,
        initialParams.pageSize,
      ),
    [filters, debouncedSearch, page, initialParams.pageSize],
  )

  const queryKey = React.useMemo(() => buildOrdersQueryKey(requestParams), [requestParams])

  const skippedInitialFetch = React.useRef(false)

  React.useEffect(() => {
    syncOrdersUrl(requestParams)
  }, [requestParams])

  React.useEffect(() => {
    if (!skippedInitialFetch.current && queryKey === initialQueryKey) {
      skippedInitialFetch.current = true
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    getOrders(requestParams)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof ApiError ? err.message : "Could not load orders"
          setError(message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [queryKey, initialQueryKey, requestParams])

  const handleSearchChange = (q: string) => {
    setSearchInput(q)
    setPage(1)
  }

  const handleStatusChange = (status: (typeof filters)["status"]) => {
    setFilters((prev) => ({ ...prev, status }))
    setPage(1)
  }

  const handleFromChange = (from: string) => {
    setFilters((prev) => ({ ...prev, from }))
    setPage(1)
  }

  const handleToChange = (to: string) => {
    setFilters((prev) => ({ ...prev, to }))
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id)
    setSheetOpen(true)
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    getOrders(requestParams)
      .then(setData)
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : "Could not load orders"
        setError(message)
      })
      .finally(() => setLoading(false))
  }

  const filterValues = { ...filters, q: searchInput }

  return (
    <div className="flex flex-col gap-6">
      <OrdersFilters
        values={filterValues}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
      />

      {error ? <ErrorState message={error} onRetry={handleRetry} /> : null}

      {loading && !error ? (
        <DataSkeleton rows={6} />
      ) : null}

      {!loading && !error && data.items.length === 0 ? (
        <EmptyState
          title="No orders match your filters"
          description="Try clearing search or widening the date range."
        />
      ) : null}

      {!loading && !error && data.items.length > 0 ? (
        <>
          <OrdersDataTable orders={data.items} onSelectOrder={handleSelectOrder} />
          <OrdersPagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}

      <OrderDetailSheet
        orderId={selectedOrderId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
