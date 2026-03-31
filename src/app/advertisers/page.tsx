import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";
import type { Advertiser } from "@/lib/types";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-green-100 text-green-700 border-green-200" },
  inactive: { label: "Inactivo", className: "bg-gray-100 text-gray-600 border-gray-200" },
  suspended: { label: "Suspendido", className: "bg-red-100 text-red-700 border-red-200" },
};

type AdvertisersPageState =
  | {
      kind: "ready";
      advertisers: Advertiser[];
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadAdvertisersPageState(): Promise<AdvertisersPageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const advertisers = await repository.listAdvertisers();

    if (advertisers.length === 0) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", advertisers };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function AdvertisersPage() {
  const state = await loadAdvertisersPageState();

  if (state.kind === "state") {
    return state.variant === "empty" ? (
      <IntegrationState
        variant="empty"
        actionHref="/advertisers/new"
        actionLabel="Nuevo Anunciante"
      />
    ) : (
      <IntegrationState variant={state.variant} />
    );
  }

  const { advertisers } = state;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Anunciantes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los anunciantes de la plataforma.
          </p>
        </div>
        <Button render={<Link href="/advertisers/new" />}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Anunciante
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar anunciantes..." className="pl-9" />
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
            {advertisers.map((adv) => {
              const status = statusConfig[adv.status] || statusConfig.inactive;
              return (
                <TableRow key={adv.id}>
                  <TableCell>
                    <Link
                      href={`/advertisers/${adv.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground shrink-0">
                        {adv.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium">{adv.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {adv.contact.name}
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
                    {adv.activeCampaigns}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {adv.totalImpressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrency(adv.monthlyBudgetCents)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
