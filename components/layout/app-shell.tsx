"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, PackageIcon } from "lucide-react"

import { AppLogo } from "@/components/layout/app-logo"
import { SidebarMenuTrigger } from "@/components/layout/sidebar-menu-trigger"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/orders", label: "Orders", icon: PackageIcon },
]

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Orders",
}

type AppShellProps = {
  children: React.ReactNode
}

const ShellNav = () => {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleNavClick = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={active}
              className="min-h-11"
              render={<Link href={item.href} onClick={handleNavClick} />}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname()
  const crumb = pageTitles[pathname] ?? "Pulseboard"

  return (
    <SidebarProvider>
      <Sidebar side="left" mobileSide="right" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="flex h-14 shrink-0 justify-center border-b border-border px-4">
          <AppLogo variant="full" href="/" className="w-full" />
        </SidebarHeader>
        <SidebarContent className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <ShellNav />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarSeparator className="mb-3" />
          <div className="flex flex-col gap-2 px-1">
            <Badge variant="outline" className="w-fit font-normal text-muted-foreground">
              Mock API
            </Badge>
            <p className="text-xs text-muted-foreground">Seed data · shadcn/ui</p>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="min-h-svh">
        <div className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 lg:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-3">
            <SidebarTrigger
              className={cn("size-9 shrink-0 max-lg:hidden")}
              aria-label="Toggle sidebar"
            />
            <Separator orientation="vertical" className={cn("hidden h-6 bg-border lg:block")} />
            <AppLogo variant="mark" href="/" className="shrink-0 lg:hidden" />
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="hidden truncate sm:inline">Pulseboard</span>
              <span className="hidden text-border sm:inline" aria-hidden>
                /
              </span>
              <span className="truncate font-medium text-foreground">{crumb}</span>
            </nav>
          </div>
          <SidebarMenuTrigger className="lg:hidden" />
        </div>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
