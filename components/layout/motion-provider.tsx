"use client"

import { MotionConfig } from "motion/react"

import { motionTokens } from "@/lib/motion/tokens"

type MotionProviderProps = {
  children: React.ReactNode
}

export const MotionProvider = ({ children }: MotionProviderProps) => {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: motionTokens.durationNormal }}>
      {children}
    </MotionConfig>
  )
}
