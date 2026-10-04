"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, PackageIcon } from "lucide-react"

import { AppLogo } from "@/components/layout/app-logo"
import { SidebarMenuTrigger } from "@/components/layout/sidebar-menu-trigger"
import { Badge } from "@/components/ui/badge"
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

const groupLabelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50"

const shellTopChrome = "flex h-14 shrink-0 items-center border-b border-border"

const shellSideInset = "px-4"

const shellNavIconSlot =
  "flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"

const shellNavButtonClass =
  "h-10 w-full items-center justify-start gap-3 rounded-md pl-4 pr-3 data-active:before:left-0 data-active:before:h-8"

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
    <SidebarMenu className="gap-0.5">
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={active}
              tooltip={item.label}
              className={shellNavButtonClass}
              render={
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  aria-current={active ? "page" : undefined}
                />
              }
            >
              <span className={shellNavIconSlot} aria-hidden>
                <item.icon />
              </span>
              <span className="leading-none">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

const EnvironmentBlock = () => {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-border bg-sidebar-accent/30 px-3 py-2.5">
      <Badge variant="info" className="w-fit font-medium">
        Seed
      </Badge>
      <p className="text-xs leading-snug text-muted-foreground">Mock API · shadcn/ui</p>
    </div>
  )
}

export const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname()
  const headerTitle = pageTitles[pathname] ?? "Pulseboard"

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        side="left"
        mobileSide="right"
        variant="sidebar"
        collapsible="offcanvas"
        className="border-border"
      >
        <SidebarHeader
          className={cn(
            shellTopChrome,
            "flex-row items-center justify-start gap-0 bg-sidebar p-0",
            shellSideInset,
          )}
        >
          <AppLogo variant="full" density="chrome" href="/" />
        </SidebarHeader>
        <SidebarContent className="gap-4 py-4">
          <SidebarGroup className="gap-1.5 p-0">
            <SidebarGroupLabel className={cn(groupLabelClass, "h-auto px-4 py-0")}>
              Project
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <ShellNav />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className={cn("border-t border-border py-4", shellSideInset)}>
          <SidebarGroup className="gap-1.5 p-0">
            <SidebarGroupLabel className={cn(groupLabelClass, "h-auto px-0 py-0")}>
              Environment
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <EnvironmentBlock />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header
          className={cn(
            shellTopChrome,
            "sticky top-0 z-20 gap-2 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:gap-3",
          )}
        >
          <AppLogo variant="mark" density="chrome" href="/" className="shrink-0 md:hidden" />
          <nav
            className="min-w-0 flex-1 truncate text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <ol className="flex min-w-0 items-center gap-1.5">
              <li className="hidden shrink-0 md:list-item">
                <Link href="/" className="transition-colors hover:text-foreground">
                  Pulseboard
                </Link>
              </li>
              <li className="hidden shrink-0 text-muted-foreground/60 md:list-item" aria-hidden>
                /
              </li>
              <li className="min-w-0 truncate font-medium text-foreground">{headerTitle}</li>
            </ol>
          </nav>
          <SidebarMenuTrigger className="md:hidden" />
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
