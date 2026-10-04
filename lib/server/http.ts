import { NextResponse } from "next/server"

export const jsonError = (status: number, message: string) =>
  NextResponse.json({ error: message }, { status })

export const parsePositiveInt = (value: string | null, fallback: number, max?: number) => {
  if (!value) return fallback
  const n = Number.parseInt(value, 10)
  if (Number.isNaN(n) || n < 1) {
    throw new Error("Invalid integer parameter")
  }
  if (max && n > max) return max
  return n
}
