import { readFile } from "node:fs/promises"
import path from "node:path"

import type { Activity, Customer, Order } from "@/lib/types"
import {
  activitiesFileSchema,
  customersFileSchema,
  ordersFileSchema,
} from "@/lib/server/schemas"

const seedDir = path.join(process.cwd(), "data", "seed")

type SeedCache = {
  customers: Customer[]
  orders: Order[]
  activities: Activity[]
}

let cache: SeedCache | null = null

const loadJson = async (filename: string) => {
  const filePath = path.join(seedDir, filename)
  const raw = await readFile(filePath, "utf8")
  return JSON.parse(raw) as unknown
}

export const getSeedData = async (): Promise<SeedCache> => {
  if (cache) return cache

  const customersRaw = await loadJson("customers.json")
  const ordersRaw = await loadJson("orders.json")
  const activitiesRaw = await loadJson("activities.json")

  const customers = customersFileSchema.parse(customersRaw)
  const orders = ordersFileSchema.parse(ordersRaw)
  const activities = activitiesFileSchema.parse(activitiesRaw)

  cache = { customers, orders, activities }
  return cache
}

/** Server only: UI must not import this module. */
export const readSeedJson = async <T>(filename: string): Promise<T> => {
  const raw = await loadJson(filename)
  return raw as T
}
