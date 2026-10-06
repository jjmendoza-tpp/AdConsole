"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";
import type { Advertiser } from "@/lib/types";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-green-100 text-green-700 border-green-200" },
  inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-600 border-gray-200" },
  suspended: { label: "Suspendido", className: "bg-red-100 text-red-700 border-red-200" },
};

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
  })}`;
}

export function AdvertisersPageClient({
  initialAdvertisers,
}: {
  initialAdvertisers: Advertiser[];
}) {
  const { advertisers: runtimeAdvertisers, getViewHref, hydrated } = useAdConsoleApp();
  const advertisers = hydrated ? runtimeAdvertisers : initialAdvertisers;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";

  const filteredAdvertisers = advertisers.filter((advertiser) => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return true;
    }

    return (
      advertiser.name.toLowerCase().includes(normalized) ||
      advertiser.contact.name.toLowerCase().includes(normalized) ||
      advertiser.contact.email.toLowerCase().includes(normalized)
    );
  });

  function updateQuery(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("query", value);
    } else {
      params.delete("query");
    }

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Anunciantes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los anunciantes de la plataforma.
          </p>
        </div>
        <Button render={<Link href={getViewHref("/advertisers/new")} />}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Anunciante
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Buscar anunciantes..."
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anunciante</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Campañas Activas</TableHead>
              <TableHead className="text-right">Impresiones</TableHead>
              <TableHead className="text-right">Budget Mensual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdvertisers.map((advertiser) => {
              const status = statusConfig[advertiser.status] || statusConfig.inactive;

              return (
                <TableRow key={advertiser.id}>
                  <TableCell>
                    <Link
                      href={getViewHref(`/advertisers/${advertiser.id}`)}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground shrink-0">
                        {advertiser.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium">{advertiser.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {advertiser.contact.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${status.className}`}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {advertiser.activeCampaigns}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {advertiser.totalImpressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrency(advertiser.monthlyBudgetCents)}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredAdvertisers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No hay anunciantes que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
