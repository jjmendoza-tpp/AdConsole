"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Pause, Play, Calendar, Eye, MousePointerClick, TrendingUp, DollarSign, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { campaigns } from "@/lib/mock-data";
import type { CampaignStatus } from "@/lib/types";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function generatePerformanceData(totalImpressions: number, totalClicks: number) {
  const days = 14;
  const data = [];
  const baseImpressions = Math.floor(totalImpressions / days);
  const baseClicks = Math.floor(totalClicks / days);

  for (let i = 0; i < days; i++) {
    const variance = 0.7 + Math.random() * 0.6;
    const impressions = Math.floor(baseImpressions * variance);
    const clicks = Math.floor(baseClicks * variance);
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));

    data.push({
      date: date.toLocaleDateString("es", { day: "numeric", month: "short" }),
      impressions,
      clicks,
    });
  }
  return data;
}

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  web: "Web Chat",
  voice: "Voz",
  telegram: "Telegram",
};

const intentLabels: Record<string, string> = {
  product_search: "Búsqueda de producto",
  price_comparison: "Comparación de precios",
  brand_inquiry: "Consulta de marca",
  general_info: "Información general",
};

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-xl font-semibold">Campaña no encontrada</h2>
        <Button render={<Link href="/campaigns" />} variant="outline">
          Volver a campañas
        </Button>
      </div>
    );
  }

  const performanceData = generatePerformanceData(campaign.totalImpressions, campaign.totalClicks);
  const budgetPercent = campaign.totalBudgetCents > 0
    ? Math.round((campaign.spentCents / campaign.totalBudgetCents) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button render={<Link href="/campaigns" />} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {campaign.name}
              </h1>
              <StatusBadge status={campaign.status as CampaignStatus} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {campaign.advertiserName} · {campaign.adSpaceName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Editar
          </Button>
          {campaign.status === "active" && (
            <Button variant="outline" size="sm">
              <Pause className="h-3.5 w-3.5 mr-1.5" />
              Pausar
            </Button>
          )}
          {campaign.status === "paused" && (
            <Button variant="outline" size="sm">
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Reactivar
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Impresiones</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {campaign.totalImpressions.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-0.5">+18% conversión</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Clicks</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {campaign.totalClicks.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">CTR</p>
            <p className="text-2xl font-bold tabular-nums mt-1">{campaign.ctr}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Gastado</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {formatCurrency(campaign.spentCents)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Presupuesto</p>
            <p className="text-2xl font-bold tabular-nums mt-1">
              {formatCurrency(campaign.totalBudgetCents)}
            </p>
            <div className="mt-2">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{budgetPercent}% utilizado</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Rendimiento — Últimos 14 días
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillImpDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3366CC" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3366CC" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} width={50} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="impressions" name="Impresiones" stroke="#3366CC" strokeWidth={2} fill="url(#fillImpDetail)" />
                <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#22c55e" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Configuration + Targeting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Presupuesto diario</span>
              <span className="font-medium">{formatCurrency(campaign.dailyBudgetCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Presupuesto total</span>
              <span className="font-medium">{formatCurrency(campaign.totalBudgetCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CPM</span>
              <span className="font-medium">{formatCurrency(campaign.costPerImpressionCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prioridad</span>
              <span className="font-medium">{campaign.priority}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fechas</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {campaign.schedule.startDate} → {campaign.schedule.endDate}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Targeting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Palabras clave</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaign.targetKeywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Intenciones</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaign.targetIntents.map((i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {intentLabels[i] || i}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Canales</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaign.targetChannels.map((ch) => (
                  <Badge key={ch} variant="secondary" className="text-xs">
                    {channelLabels[ch] || ch}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creative */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Creativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Plantilla del mensaje</span>
            <p className="mt-1 rounded-md bg-muted/50 p-3 font-mono text-xs">
              {campaign.messageTemplate}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {campaign.ctaUrl && (
              <div>
                <span className="text-muted-foreground">URL destino</span>
                <p className="font-medium text-primary truncate mt-0.5">{campaign.ctaUrl}</p>
              </div>
            )}
            {campaign.creativeData?.buttonText && (
              <div>
                <span className="text-muted-foreground">Texto del botón</span>
                <p className="font-medium mt-0.5">{campaign.creativeData.buttonText}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
