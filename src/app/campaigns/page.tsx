"use client";

import Link from "next/link";
import { Plus, Search, SlidersHorizontal, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { campaigns } from "@/lib/mock-data";
import type { CampaignStatus } from "@/lib/types";

const statusTabs: { value: string; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "paused", label: "Pausadas" },
  { value: "draft", label: "Borradores" },
  { value: "completed", label: "Completadas" },
];

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function CampaignsTable({ status }: { status: string }) {
  const filtered =
    status === "all"
      ? campaigns
      : campaigns.filter((c) => c.status === status);

  return (
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((campaign) => (
          <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
            <TableCell>
              <Link href={`/campaigns/${campaign.id}`} className="font-medium hover:underline">
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
          </TableRow>
        ))}
        {filtered.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No hay campañas en este estado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Campañas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona y optimiza tus campañas publicitarias en Shop.PR
          </p>
        </div>
        <Button render={<Link href="/campaigns/new" />}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Campaña
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar campañas..." className="pl-9" />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <Tabs defaultValue="all">
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
          {statusTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <CampaignsTable status={tab.value} />
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex justify-between items-center border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-bold text-foreground">10</span> de <span className="font-bold text-foreground">124</span> campañas
          </p>
          <div className="flex items-center gap-1">
            <Button size="sm" className="h-8 w-8 p-0">1</Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">2</Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">3</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
