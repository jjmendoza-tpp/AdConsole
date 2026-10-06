"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Campaign, ChannelBreakdown, RevenueDataPoint } from "@/lib/types";
import {
  analyticsAlerts,
  analyticsInventoryMix,
} from "@/lib/adconsole/demo-fixtures";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Rocket,
  AlertTriangle,
  Key,
} from "lucide-react";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";

interface AnalyticsPageProps {
  campaigns: Campaign[];
  revenueData: RevenueDataPoint[];
  channelBreakdown: ChannelBreakdown[];
}

function getRevenueChartData(revenueData: RevenueDataPoint[]) {
  return revenueData.map((point) => ({
    ...point,
    dateLabel: new Date(point.date).toLocaleDateString("es", {
      day: "numeric",
      month: "short",
    }),
  }));
}

function getCampaignsByStatus(campaigns: Campaign[]) {
  return [
    { status: "Activas", count: campaigns.filter((campaign) => campaign.status === "active").length, color: "#22c55e" },
    { status: "Pausadas", count: campaigns.filter((campaign) => campaign.status === "paused").length, color: "#eab308" },
    { status: "Borradores", count: campaigns.filter((campaign) => campaign.status === "draft").length, color: "#6b7280" },
    { status: "Completadas", count: campaigns.filter((campaign) => campaign.status === "completed").length, color: "#3366CC" },
  ];
}

function getTopCampaigns(campaigns: Campaign[]) {
  return [...campaigns]
    .sort((left, right) => right.totalImpressions - left.totalImpressions)
    .slice(0, 8)
    .map((campaign) => ({
      name: campaign.name.length > 20 ? `${campaign.name.slice(0, 20)}…` : campaign.name,
      impressions: campaign.totalImpressions,
      clicks: campaign.totalClicks,
    }));
}

const analyticsAlertConfig = {
  performance: {
    icon: Rocket,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  budget: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  keywords: {
    icon: Key,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
} as const;

export function AnalyticsPage({
  campaigns,
  revenueData,
  channelBreakdown,
}: AnalyticsPageProps) {
  const {
    campaigns: runtimeCampaigns,
    downloadCsv,
    hydrated,
    pushFeedback,
  } = useAdConsoleApp();
  const [range, setRange] = useState<7 | 14 | 30>(30);
  const [reportDialog, setReportDialog] = useState<null | "detailed" | "campaigns" | "inventory">(null);
  const activeCampaigns = hydrated ? runtimeCampaigns : campaigns;
  const filteredRevenueData = revenueData.slice(-range);
  const revenueChartData = useMemo(
    () => getRevenueChartData(filteredRevenueData),
    [filteredRevenueData],
  );
  const campaignsByStatus = useMemo(
    () => getCampaignsByStatus(activeCampaigns),
    [activeCampaigns],
  );
  const topCampaigns = useMemo(
    () => getTopCampaigns(activeCampaigns),
    [activeCampaigns],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualiza el rendimiento de tus campañas en tiempo real
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <Calendar className="mr-2 h-4 w-4" />
            Últimos {range} días
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {[7, 14, 30].map((option) => (
              <DropdownMenuItem key={option} onClick={() => setRange(option as 7 | 14 | 30)}>
                Últimos {option} días
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Revenue (30d)</p>
            <p className="text-2xl font-bold tabular-nums">$12,220</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12%
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Ventas en Shop.PR</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Impresiones (30d)</p>
            <p className="text-2xl font-bold tabular-nums">499,847</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +5.4%
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Visibilidad total de anuncios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">Clicks (30d)</p>
            <p className="text-2xl font-bold tabular-nums">24,064</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 mt-1">
              <TrendingDown className="h-3 w-3" />
              -2.1%
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Interacciones directas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground">CTR Promedio</p>
            <p className="text-2xl font-bold tabular-nums">4.8%</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +0.8%
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">Tasa de click-through</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList variant="line">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="channels">Canales</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Revenue — Últimos 30 días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3366CC" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3366CC" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} interval={4} />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} width={50} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3366CC" strokeWidth={2} fill="url(#fillRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between border-t pt-4 mt-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Top Advertiser: </span>
                  <span className="font-bold">Supermercados Econo</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ROAS Promedio: </span>
                  <span className="font-bold">4.2x</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CPM Medio: </span>
                  <span className="font-bold">$2.45</span>
                </div>
                <button
                  type="button"
                  onClick={() => setReportDialog("detailed")}
                  className="text-primary inline-flex items-center gap-1 hover:underline"
                >
                  Ver reporte detallado
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Campañas por Estado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={campaignsByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="status"
                        >
                          {campaignsByStatus.map((entry) => (
                            <Cell key={entry.status} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">
                      Top Campañas por Impresiones
                    </CardTitle>
                    <button
                      type="button"
                      onClick={() => setReportDialog("campaigns")}
                      className="text-xs text-primary hover:underline"
                    >
                      Ver Reporte Full
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topCampaigns} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} axisLine={false} width={120} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        <Bar dataKey="impressions" fill="#3366CC" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Alertas e Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analyticsAlerts.map((alert) => {
                  const alertConfig = analyticsAlertConfig[alert.kind];

                  return (
                  <div key={alert.title} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${alertConfig.iconBg}`}>
                      <alertConfig.icon className={`h-4 w-4 ${alertConfig.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                  </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="channels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Distribución por Canal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="percentage"
                        nameKey="label"
                      >
                        {channelBreakdown.map((entry) => (
                          <Cell key={entry.channel} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Mix de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsInventoryMix.map((channel) => (
                  <div key={channel.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{channel.name}</span>
                      <span className="font-medium">{channel.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${channel.percentage}%`, backgroundColor: channel.color }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={reportDialog !== null} onOpenChange={(open) => !open && setReportDialog(null)}>
        <DialogContent className="max-w-xl" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {reportDialog === "detailed"
                ? "Reporte detallado de revenue"
                : reportDialog === "campaigns"
                ? "Reporte full de campañas"
                : "Reporte de inventario"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {reportDialog === "detailed" && (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Revenue consolidado para los últimos {range} días con foco en ROAS, CPM y top advertiser.
                </p>
                <ul className="space-y-2 rounded-lg border bg-muted/20 p-4">
                  <li>Revenue acumulado: ${filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</li>
                  <li>Clicks acumulados: {filteredRevenueData.reduce((sum, item) => sum + item.clicks, 0).toLocaleString()}</li>
                  <li>Impresiones acumuladas: {filteredRevenueData.reduce((sum, item) => sum + item.impressions, 0).toLocaleString()}</li>
                </ul>
              </div>
            )}
            {reportDialog === "campaigns" && (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Resumen ampliado de las campañas más visibles para el rango seleccionado.
                </p>
                <ul className="space-y-2 rounded-lg border bg-muted/20 p-4">
                  {topCampaigns.slice(0, 5).map((campaign) => (
                    <li key={campaign.name}>
                      {campaign.name}: {campaign.impressions.toLocaleString()} impresiones / {campaign.clicks.toLocaleString()} clicks
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {reportDialog === "inventory" && (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Mix de inventario simulado para reuniones comerciales y revisión interna.
                </p>
                <ul className="space-y-2 rounded-lg border bg-muted/20 p-4">
                  {analyticsInventoryMix.map((item) => (
                    <li key={item.name}>
                      {item.name}: {item.percentage}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialog(null)}>
              Cerrar
            </Button>
            <Button
              onClick={() => {
                const rows =
                  reportDialog === "campaigns"
                    ? topCampaigns.map((campaign) => ({
                        name: campaign.name,
                        impressions: campaign.impressions,
                        clicks: campaign.clicks,
                      }))
                    : filteredRevenueData.map((item) => ({
                        date: item.date,
                        revenue: item.revenue,
                        impressions: item.impressions,
                        clicks: item.clicks,
                      }));
                downloadCsv(
                  reportDialog === "campaigns" ? "analytics-campaigns.csv" : "analytics-revenue.csv",
                  rows,
                );
                setReportDialog(null);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
