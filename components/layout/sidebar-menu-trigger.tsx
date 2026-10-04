"use client"

import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type SidebarMenuTriggerProps = {
  className?: string
}

export const SidebarMenuTrigger = ({ className }: SidebarMenuTriggerProps) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-11 shrink-0", className)}
      onClick={toggleSidebar}
      aria-label="Open navigation menu"
    >
      <MenuIcon className="size-5" aria-hidden />
    </Button>
  )
}
