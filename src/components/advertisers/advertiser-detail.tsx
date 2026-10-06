"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, Building2, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { advertiserAnnualRevenueSeries } from "@/lib/adconsole/demo-fixtures";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";
import type { Advertiser, Campaign, CampaignStatus } from "@/lib/types";

interface AdvertiserDetailProps {
  advertiserId: string;
  initialAdvertisers: Advertiser[];
  initialCampaigns: Campaign[];
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export function AdvertiserDetail({
  advertiserId,
  initialAdvertisers,
  initialCampaigns,
}: AdvertiserDetailProps) {
  const {
    advertisers: runtimeAdvertisers,
    campaigns: runtimeCampaigns,
    getViewHref,
    hydrated,
    updateAdvertiser,
  } = useAdConsoleApp();
  const advertisers = hydrated ? runtimeAdvertisers : initialAdvertisers;
  const campaigns = hydrated ? runtimeCampaigns : initialCampaigns;
  const advertiser = advertisers.find((item) => item.id === advertiserId);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Advertiser>>({});

  if (!advertiser && !hydrated) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-xl font-semibold">Cargando anunciante...</h2>
      </div>
    );
  }

  if (!advertiser) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <h2 className="text-xl font-semibold">Anunciante no encontrado</h2>
        <Button render={<Link href={getViewHref("/advertisers")} />} variant="outline">
          Volver a anunciantes
        </Button>
      </div>
    );
  }

  const advertiserCampaigns = campaigns.filter((campaign) => campaign.advertiserId === advertiser.id);
  const ctr =
    advertiser.totalImpressions > 0
      ? ((advertiser.totalClicks / advertiser.totalImpressions) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button render={<Link href={getViewHref("/advertisers")} />} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white text-xl font-bold">
              {advertiser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {advertiser.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {advertiser.billingInfo?.companyName || "Compañía Cervecera de PR"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDraft({
                name: advertiser.name,
                contact: advertiser.contact,
                billingInfo: advertiser.billingInfo,
                monthlyBudgetCents: advertiser.monthlyBudgetCents,
                contractStart: advertiser.contractStart,
                contractEnd: advertiser.contractEnd,
              });
              setEditOpen(true);
            }}
          >
            Editar Perfil
          </Button>
          <Button
            size="sm"
            render={<Link href={getViewHref(`/campaigns/new?advertiserId=${advertiser.id}`)} />}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Nueva Campaña
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Impresiones</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {advertiser.totalImpressions.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">+18% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Clicks</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {advertiser.totalClicks.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">+9.2% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">CTR</p>
            <p className="text-2xl font-bold tabular-nums mt-1">{ctr}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">+0.3% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget Mensual</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {formatCurrency(advertiser.monthlyBudgetCents)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Responsable</p>
                <p>{advertiser.contact.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-primary">{advertiser.contact.email}</p>
              </div>
            </div>
            {advertiser.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Teléfono</p>
                  <p>{advertiser.contact.phone}</p>
                </div>
              </div>
            )}
            {advertiser.contractStart && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Vigencia Contrato</p>
                  <p>{advertiser.contractStart} → {advertiser.contractEnd}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Desempeño Anual</CardTitle>
            <p className="text-xs text-muted-foreground">
              Ingresos por publicidad. CTR a 2.1% regional. Crecimiento con más ads.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={advertiserAnnualRevenueSeries} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} width={50} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#3366CC" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Campañas ({advertiserCampaigns.length})
            </CardTitle>
            <Link
              href={getViewHref(`/campaigns?advertiser=${encodeURIComponent(advertiser.name)}`)}
              className="text-xs text-primary hover:underline"
            >
              Ver todas
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {advertiserCampaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/campaigns/${campaign.id}`}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <StatusBadge status={campaign.status as CampaignStatus} />
                <div>
                  <p className="text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {campaign.totalImpressions.toLocaleString()} imp · {campaign.ctr}% CTR
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Gastado</p>
                <p className="text-sm font-medium tabular-nums">{formatCurrency(campaign.spentCents)}</p>
              </div>
            </Link>
          ))}
          {advertiserCampaigns.length === 0 && (
            <p className="text-center py-6 text-muted-foreground text-sm">
              Sin campañas registradas.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Editar perfil del anunciante</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="advertiser-name">Nombre</Label>
              <Input
                id="advertiser-name"
                value={draft.name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertiser-contact-name">Contacto</Label>
              <Input
                id="advertiser-contact-name"
                value={draft.contact?.name ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      email: current.contact?.email ?? advertiser.contact.email,
                      phone: current.contact?.phone ?? advertiser.contact.phone,
                      name: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertiser-contact-email">Email</Label>
              <Input
                id="advertiser-contact-email"
                value={draft.contact?.email ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      name: current.contact?.name ?? advertiser.contact.name,
                      phone: current.contact?.phone ?? advertiser.contact.phone,
                      email: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertiser-phone">Teléfono</Label>
              <Input
                id="advertiser-phone"
                value={draft.contact?.phone ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      name: current.contact?.name ?? advertiser.contact.name,
                      email: current.contact?.email ?? advertiser.contact.email,
                      phone: event.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertiser-company">Razón social</Label>
              <Input
                id="advertiser-company"
                value={draft.billingInfo?.companyName ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    billingInfo: {
                      ...current.billingInfo,
                      companyName: event.target.value,
                      taxId: current.billingInfo?.taxId ?? advertiser.billingInfo?.taxId,
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="advertiser-tax-id">Tax ID</Label>
              <Input
                id="advertiser-tax-id"
                value={draft.billingInfo?.taxId ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    billingInfo: {
                      ...current.billingInfo,
                      companyName: current.billingInfo?.companyName ?? advertiser.billingInfo?.companyName,
                      taxId: event.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                updateAdvertiser(advertiser.id, draft);
                setEditOpen(false);
              }}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
