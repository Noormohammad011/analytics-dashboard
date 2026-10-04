import { writeFile, mkdir } from "node:fs/promises"
import path from "node:path"

const seedDir = path.join(process.cwd(), "data", "seed")

const statuses = ["pending", "paid", "shipped", "cancelled", "refunded"]
const firstNames = ["Ava", "Noah", "Mia", "Liam", "Zoe", "Ethan", "Luna", "Omar", "Ivy", "Kai"]
const lastNames = ["Chen", "Patel", "Nguyen", "Garcia", "Kim", "Rossi", "Walsh", "Singh", "Brown", "Lee"]

const random = (seed) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rnd = random(42)

const daysAgo = (days) => {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  d.setUTCHours(12, 0, 0, 0)
  return d.toISOString()
}

const customers = []
for (let i = 1; i <= 25; i += 1) {
  const fn = firstNames[i % firstNames.length]
  const ln = lastNames[(i * 3) % lastNames.length]
  customers.push({
    id: `cust_${String(i).padStart(3, "0")}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
    createdAt: daysAgo(120 + i),
    status: i % 7 === 0 ? "churned" : "active",
  })
}

const orders = []
for (let i = 1; i <= 55; i += 1) {
  const customer = customers[i % customers.length]
  const status = statuses[Math.floor(rnd() * statuses.length)]
  const qty = 1 + Math.floor(rnd() * 3)
  const unit = 1500 + Math.floor(rnd() * 25000)
  const lineItems = [
    {
      name: `Plan tier ${(i % 4) + 1}`,
      quantity: qty,
      unitPriceCents: unit,
    },
  ]
  const amountCents = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPriceCents, 0)
  orders.push({
    id: `ord_${String(i).padStart(4, "0")}`,
    customerId: customer.id,
    amountCents,
    currency: "USD",
    status,
    createdAt: daysAgo(Math.floor(rnd() * 90)),
    lineItems,
  })
}

const activities = []
for (let i = 1; i <= 35; i += 1) {
  const order = orders[i % orders.length]
  const types = ["order_created", "payment_failed", "shipment", "system"]
  const type = types[i % types.length]
  activities.push({
    id: `act_${String(i).padStart(3, "0")}`,
    type,
    message:
      type === "order_created"
        ? `Order ${order.id} created`
        : type === "payment_failed"
          ? `Payment failed for ${order.id}`
          : type === "shipment"
            ? `Shipment dispatched for ${order.id}`
            : "Scheduled maintenance completed",
    createdAt: daysAgo(Math.floor(rnd() * 30)),
    metadata: {
      orderId: order.id,
      customerId: order.customerId,
    },
  })
}

await mkdir(seedDir, { recursive: true })
await writeFile(path.join(seedDir, "customers.json"), JSON.stringify(customers, null, 2))
await writeFile(path.join(seedDir, "orders.json"), JSON.stringify(orders, null, 2))
await writeFile(path.join(seedDir, "activities.json"), JSON.stringify(activities, null, 2))

console.log(
  `Wrote ${customers.length} customers, ${orders.length} orders, ${activities.length} activities`,
)
