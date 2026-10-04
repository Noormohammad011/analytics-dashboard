import { readFile } from "node:fs/promises"
import path from "node:path"

const seedDir = path.join(process.cwd(), "data", "seed")

const read = async (name) => JSON.parse(await readFile(path.join(seedDir, name), "utf8"))

const customers = await read("customers.json")
const orders = await read("orders.json")
const activities = await read("activities.json")

const ok =
  customers.length >= 20 &&
  orders.length >= 50 &&
  activities.length >= 30

if (!ok) {
  console.error("Seed counts failed", {
    customers: customers.length,
    orders: orders.length,
    activities: activities.length,
  })
  process.exit(1)
}

console.log("Seed OK", {
  customers: customers.length,
  orders: orders.length,
  activities: activities.length,
})
