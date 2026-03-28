"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/campaigns": "Campanas",
  "/campaigns/new": "Nueva Campana",
  "/advertisers": "Anunciantes",
  "/advertisers/new": "Nuevo Anunciante",
  "/ad-spaces": "Espacios Publicitarios",
  "/analytics": "Analytics",
  "/keywords": "Keywords",
  "/settings": "Ajustes",
};

export function TopHeader() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const currentLabel = routeLabels[pathname] || segments[segments.length - 1] || "Dashboard";
  const parentPath = segments.length > 1 ? `/${segments[0]}` : null;
  const parentLabel = parentPath ? routeLabels[parentPath] : null;

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />

      <Breadcrumb>
        <BreadcrumbList>
          {parentLabel && parentPath && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href={parentPath}>
                  {parentLabel}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="h-8 w-56 pl-8 text-sm bg-muted/50 border-transparent focus:border-border focus:bg-background transition-colors"
          />
        </div>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
            3
          </span>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[#22C55E] status-dot-pulse" />
          Conectado
        </div>
      </div>
    </header>
  );
}
