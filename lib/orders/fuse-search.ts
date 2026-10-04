import Fuse from "fuse.js"

import type { Order } from "@/lib/types"

export type OrderSearchRow = {
  order: Order
  customerName: string
}

const toSearchable = (row: OrderSearchRow) => ({
  id: row.order.id,
  customerName: row.customerName,
  status: row.order.status,
  row,
})

export const filterOrdersByFuseQuery = (
  rows: OrderSearchRow[],
  q: string,
): OrderSearchRow[] => {
  const needle = q.trim()
  if (!needle) return rows

  const fuse = new Fuse(rows.map(toSearchable), {
    keys: ["id", "customerName", "status"],
    threshold: 0.4,
    ignoreLocation: true,
  })

  return fuse.search(needle).map((result) => result.item.row)
}
