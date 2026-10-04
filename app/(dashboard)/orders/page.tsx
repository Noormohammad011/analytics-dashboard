import { PageHeader } from "@/components/layout/page-header"
import { OrdersView } from "@/components/orders/orders-view"
import { getOrders } from "@/lib/api/orders"
import {
  buildOrdersQueryKey,
  parseOrdersSearchParams,
} from "@/lib/orders/search-params"

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const resolved = await searchParams
  const initialParams = parseOrdersSearchParams(resolved)
  const initialQueryKey = buildOrdersQueryKey(initialParams)
  const initialData = await getOrders(initialParams)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        title="Orders"
        description="Search, filter, and inspect orders from the mock API."
      />
      <OrdersView
        initialData={initialData}
        initialParams={initialParams}
        initialQueryKey={initialQueryKey}
      />
    </div>
  )
}
