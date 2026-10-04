import { z } from "zod"

import { ACTIVITY_TYPES, CUSTOMER_STATUSES, ORDER_STATUSES } from "@/lib/types"

const lineItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
})

export const customerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  status: z.enum(CUSTOMER_STATUSES),
})

export const orderSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  amountCents: z.number().int().nonnegative(),
  currency: z.string().min(3).max(3),
  status: z.enum(ORDER_STATUSES),
  createdAt: z.string().datetime(),
  lineItems: z.array(lineItemSchema).min(1),
})

export const activitySchema = z.object({
  id: z.string().min(1),
  type: z.enum(ACTIVITY_TYPES),
  message: z.string().min(1),
  createdAt: z.string().datetime(),
  metadata: z
    .object({
      orderId: z.string().optional(),
      customerId: z.string().optional(),
    })
    .optional(),
})

export const customersFileSchema = z.array(customerSchema)
export const ordersFileSchema = z.array(orderSchema)
export const activitiesFileSchema = z.array(activitySchema)
