"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, HelpCircle } from "lucide-react";
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4 bg-slate-200" />

        <Breadcrumb>
          <BreadcrumbList className="gap-2 text-sm font-medium">
            {parentLabel && parentPath && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={parentPath} className="text-slate-500 transition-colors hover:text-primary">
                    {parentLabel}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-300" />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-slate-500">
                {currentLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar..."
            className="h-9 w-64 rounded-lg border-none bg-slate-100/60 pl-10 text-sm focus-visible:border-primary/20 focus-visible:ring-3 focus-visible:ring-primary/15"
          />
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 md:flex">
          <span className="h-2 w-2 rounded-full bg-green-500 status-dot-pulse" />
          Estado: Activo
        </div>

        <Button variant="ghost" size="icon-sm" className="relative text-slate-500 hover:text-primary">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#EF4444] text-[10px] font-bold text-white">
            3
          </span>
        </Button>
        <Button variant="ghost" size="icon-sm" className="text-slate-500 hover:text-primary">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
