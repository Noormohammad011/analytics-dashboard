"use client"

import { motion } from "motion/react"

import { motionTokens } from "@/lib/motion/tokens"
import { usePrefersReducedMotion } from "@/lib/motion/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

type StaggerChildrenProps = {
  children: React.ReactNode
  className?: string
}

export const StaggerChildren = ({ children, className }: StaggerChildrenProps) => {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : motionTokens.staggerKpi,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

type FadeInItemProps = {
  children: React.ReactNode
  className?: string
}

export const FadeInItem = ({ children, className }: FadeInItemProps) => {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: motionTokens.enterOffsetY },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: motionTokens.durationNormal,
            ease: motionTokens.easeEnter,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
