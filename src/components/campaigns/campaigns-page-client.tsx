"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, MoreVertical, Plus, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";
import type { Campaign, CampaignStatus } from "@/lib/types";

const statusTabs: { value: string; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "paused", label: "Pausadas" },
  { value: "draft", label: "Borradores" },
  { value: "completed", label: "Completadas" },
];

const PAGE_SIZE = 6;

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function clampPage(page: number, maxPage: number) {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.min(page, maxPage);
}

export function CampaignsPageClient({
  initialCampaigns,
}: {
  initialCampaigns: Campaign[];
}) {
  const { campaigns: runtimeCampaigns, advertisers, downloadCsv, getViewHref, hydrated, setCampaignStatus } = useAdConsoleApp();
  const campaigns = hydrated ? runtimeCampaigns : initialCampaigns;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeStatus = searchParams.get("status") ?? "all";
  const query = searchParams.get("query") ?? "";
  const advertiserFilter = searchParams.get("advertiser") ?? "all";
  const page = Number(searchParams.get("page") ?? "1");

  const advertiserOptions = useMemo(() => {
    const values = new Set(campaigns.map((campaign) => campaign.advertiserName));
    return [...values].sort();
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesStatus =
        activeStatus === "all" ? true : campaign.status === activeStatus;
      const matchesAdvertiser =
        advertiserFilter === "all"
          ? true
          : campaign.advertiserName === advertiserFilter;
      const matchesQuery =
        normalizedQuery.length === 0
          ? true
          : campaign.name.toLowerCase().includes(normalizedQuery) ||
            campaign.advertiserName.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesAdvertiser && matchesQuery;
    });
  }, [activeStatus, advertiserFilter, campaigns, query]);

  const totalPages = Math.max(1, Math.ceil(filteredCampaigns.length / PAGE_SIZE));
  const currentPage = clampPage(page, totalPages);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }

  const statusForRoute = activeStatus === "all" ? null : activeStatus;
  const pageWindow = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Campañas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona y optimiza tus campañas publicitarias en Shop.PR
          </p>
        </div>
        <Button render={<Link href={getViewHref("/campaigns/new")} />}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) =>
              updateParams({
                query: event.target.value,
                page: "1",
              })
            }
            placeholder="Buscar campañas o anunciantes..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => setFiltersOpen(true)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv(
              "campaigns-export.csv",
              paginatedCampaigns.map((campaign) => ({
                name: campaign.name,
                advertiser: campaign.advertiserName,
                status: campaign.status,
                impressions: campaign.totalImpressions,
                ctr: `${campaign.ctr}%`,
                spentUsd: (campaign.spentCents / 100).toFixed(2),
              })),
            )
          }
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <Tabs
          value={activeStatus}
          onValueChange={(value) =>
            updateParams({
              status: value,
              page: "1",
            })
          }
        >
          <div className="border-b border-border px-4">
            <TabsList className="bg-transparent h-auto p-0 gap-0">
              {statusTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-active:border-primary data-active:text-foreground data-active:bg-transparent data-active:shadow-none px-4 py-3 text-sm transition-colors"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value={activeStatus} className="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Anunciante</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Impresiones</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Gastado</TableHead>
                  <TableHead className="text-right">Presupuesto</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={getViewHref(`/campaigns/${campaign.id}`)}
                        className="font-medium hover:underline"
                      >
                        {campaign.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {campaign.advertiserName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={campaign.status as CampaignStatus} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {campaign.totalImpressions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {campaign.ctr}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(campaign.spentCents)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(campaign.totalBudgetCents)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0" />}>
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => router.push(getViewHref(`/campaigns/${campaign.id}`))}
                          >
                            Ver detalle
                          </DropdownMenuItem>
                          {campaign.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => setCampaignStatus(campaign.id, "paused")}
                            >
                              Pausar campaña
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setCampaignStatus(campaign.id, "active")}
                            >
                              Reactivar campaña
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedCampaigns.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No hay campañas que coincidan con los filtros activos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        <div className="flex justify-between items-center border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-bold text-foreground">{paginatedCampaigns.length}</span> de{" "}
            <span className="font-bold text-foreground">{filteredCampaigns.length}</span> campañas
          </p>
          <div className="flex items-center gap-1">
            {pageWindow.map((pageNumber) => (
              <Button
                key={pageNumber}
                size="sm"
                variant={pageNumber === currentPage ? "default" : "outline"}
                className="h-8 w-8 p-0"
                onClick={() => updateParams({ page: String(pageNumber) })}
              >
                {pageNumber}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Filtros de campañas</DialogTitle>
            <DialogDescription>
              Ajusta la vista actual sin salir del prototipo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Anunciante</label>
              <Select
                value={advertiserFilter}
                onValueChange={(value) => updateParams({ advertiser: value, page: "1" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los anunciantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los anunciantes</SelectItem>
                  {advertiserOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
              Estado actual: <span className="font-medium text-foreground">{statusForRoute ?? "Todas"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFiltersOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
