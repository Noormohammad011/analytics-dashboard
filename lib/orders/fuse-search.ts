import Fuse from "fuse.js"

import type { Order } from "@/lib/types"

export type OrderSearchRow = {
  order: Order
  customerName: string
}

const ORDER_ID_PATTERN = /^ord_[\w-]+$/i
const CUSTOMER_ID_PATTERN = /^cust_[\w-]+$/i

const normalize = (value: string) => value.trim().toLowerCase()

const filterByOrderId = (rows: OrderSearchRow[], needle: string) => {
  const target = normalize(needle)
  const exact = rows.filter((row) => normalize(row.order.id) === target)
  if (exact.length > 0) return exact
  return rows.filter((row) => normalize(row.order.id).includes(target))
}

const filterByCustomerId = (rows: OrderSearchRow[], needle: string) => {
  const target = normalize(needle)
  return rows.filter((row) => normalize(row.order.customerId) === target)
}

const toSearchable = (row: OrderSearchRow) => ({
  customerName: row.customerName,
  row,
})

export const filterOrdersByFuseQuery = (
  rows: OrderSearchRow[],
  q: string,
): OrderSearchRow[] => {
  const needle = q.trim()
  if (!needle) return rows

  if (ORDER_ID_PATTERN.test(needle)) {
    return filterByOrderId(rows, needle)
  }

  if (CUSTOMER_ID_PATTERN.test(needle)) {
    return filterByCustomerId(rows, needle)
  }

  const fuse = new Fuse(rows.map(toSearchable), {
    keys: ["customerName"],
    threshold: 0.35,
    ignoreLocation: true,
  })

  return fuse.search(needle).map((result) => result.item.row)
}
