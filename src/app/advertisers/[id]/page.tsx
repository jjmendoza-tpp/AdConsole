"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building2, Calendar, Eye, MousePointerClick, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { advertisers, campaigns } from "@/lib/mock-data";
import type { CampaignStatus } from "@/lib/types";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

export default function AdvertiserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const advertiser = advertisers.find((a) => a.id === id);

  if (!advertiser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-xl font-semibold">Anunciante no encontrado</h2>
        <Button render={<Link href="/advertisers" />} variant="outline">
          Volver a anunciantes
        </Button>
      </div>
    );
  }

  const advertiserCampaigns = campaigns.filter(
    (c) => c.advertiserId === advertiser.id
  );
  const ctr =
    advertiser.totalImpressions > 0
      ? ((advertiser.totalClicks / advertiser.totalImpressions) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button render={<Link href="/advertisers" />} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-sm font-bold text-muted-foreground">
              {advertiser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {advertiser.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {advertiser.billingInfo?.companyName || advertiser.slug}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Eye className="h-4 w-4" />
              Impresiones
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {advertiser.totalImpressions.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MousePointerClick className="h-4 w-4" />
              Clicks
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {advertiser.totalClicks.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              CTR
            </div>
            <p className="text-2xl font-bold tabular-nums">{ctr}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Budget Mensual
            </div>
            <p className="text-2xl font-bold tabular-nums">
              {formatCurrency(advertiser.monthlyBudgetCents)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{advertiser.contact.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-primary">{advertiser.contact.email}</span>
            </div>
            {advertiser.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{advertiser.contact.phone}</span>
              </div>
            )}
            {advertiser.contractStart && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {advertiser.contractStart} → {advertiser.contractEnd}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Campañas ({advertiserCampaigns.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Impresiones</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Gastado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertiserCampaigns.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="font-medium hover:underline"
                      >
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status as CampaignStatus} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.totalImpressions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {c.ctr}%
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(c.spentCents)}
                    </TableCell>
                  </TableRow>
                ))}
                {advertiserCampaigns.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Sin campañas registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
