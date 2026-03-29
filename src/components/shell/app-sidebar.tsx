"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  LayoutGrid,
  BarChart3,
  Hash,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { CircleUserRound } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Campañas",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Anunciantes",
    href: "/advertisers",
    icon: Users,
  },
  {
    title: "Espacios",
    href: "/ad-spaces",
    icon: LayoutGrid,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Keywords",
    href: "/keywords",
    icon: Hash,
  },
];

const secondaryItems = [
  {
    title: "Ajustes",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <Link href="/" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-xl tracking-tight shrink-0 shadow-lg shadow-blue-950/20">
            Ad
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold leading-tight tracking-tight text-sidebar-foreground">
              Ad Console
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-sidebar-foreground/50">
              by Prometheus
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "h-11 rounded-none border-l-4 border-l-primary bg-primary/10 px-4 text-sidebar-foreground hover:bg-primary/12 hover:text-sidebar-foreground"
                          : "h-11 rounded-none px-4 text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className={isActive ? "font-semibold tracking-tight" : "tracking-tight"}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2 mt-2" />

        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "h-11 rounded-none border-l-4 border-l-primary bg-primary/10 px-4 text-sidebar-foreground hover:bg-primary/12 hover:text-sidebar-foreground"
                          : "h-11 rounded-none px-4 text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className={isActive ? "font-semibold tracking-tight" : "tracking-tight"}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 py-3 text-sidebar-foreground/65 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-xs font-bold text-sidebar-foreground shrink-0">
            OP
          </div>
          <div className="flex min-w-0 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              Operador
            </span>
            <span className="truncate text-[11px] text-sidebar-foreground/45">
              Shop.PR
            </span>
          </div>
          <CircleUserRound className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
