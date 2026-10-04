"use client"

import { useReducedMotion } from "motion/react"

export const usePrefersReducedMotion = () => {
  const reduced = useReducedMotion()
  return reduced ?? false
}
