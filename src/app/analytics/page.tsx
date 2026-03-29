"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import { revenueData, channelBreakdown, campaigns } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowRight,
  Rocket,
  AlertTriangle,
  Key,
} from "lucide-react";

// Revenue tab data
const revenueChartData = revenueData.map((d) => ({
  ...d,
  dateLabel: new Date(d.date).toLocaleDateString("es", { day: "numeric", month: "short" }),
}));

// Campaigns tab data — campaigns by status
const campaignsByStatus = [
  { status: "Activas", count: campaigns.filter((c) => c.status === "active").length, color: "#22c55e" },
  { status: "Pausadas", count: campaigns.filter((c) => c.status === "paused").length, color: "#eab308" },
  { status: "Borradores", count: campaigns.filter((c) => c.status === "draft").length, color: "#6b7280" },
  { status: "Completadas", count: campaigns.filter((c) => c.status === "completed").length, color: "#3366CC" },
];

// Top campaigns by impressions
const topCampaigns = [...campaigns]
  .sort((a, b) => b.totalImpressions - a.totalImpressions)
  .slice(0, 8)
  .map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
    impressions: c.totalImpressions,
    clicks: c.totalClicks,
  }));

// Channel distribution for bottom section
const channelDistribution = [
  { name: "Búsqueda", percentage: 65, color: "#3366CC" },
  { name: "Display", percentage: 25, color: "#22c55e" },
  { name: "Retargeting", percentage: 10, color: "#eab308" },
];

// Alerts data
const alerts = [
  {
    icon: Rocket,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Campaña 'Venta Otoño' superó KPI",
    description: "Incremento del 15% en conversiones durante las últimas 24 horas.",
    time: "Hace 2h",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "Presupuesto Próximo a Agotarse",
    description: "Anunciante 'Medalla Light' ha consumido el 90% de su presupuesto diario.",
    time: "Hace 5h",
  },
  {
    icon: Key,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Nuevos Insights de Keywords",
    description: "Keyword 'Café Premium PR' muestra alta intención de compra esta semana.",
    time: "Ayer",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualiza el rendimiento de tus campañas en tiempo real
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Últimos 30 días
        </Button>
      </div>

      {/* Summary KPIs */}
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

      {/* Tabs */}
      <Tabs defaultValue="revenue">
        <TabsList variant="line">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="channels">Canales</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
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
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} width={50} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3366CC" strokeWidth={2} fill="url(#fillRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Chart footer stats */}
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
                <a href="#" className="text-primary inline-flex items-center gap-1 hover:underline">
                  Ver reporte detallado
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaigns Tab */}
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
                    <a href="#" className="text-xs text-primary hover:underline">Ver Reporte Full</a>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topCampaigns} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} width={130} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        <Bar dataKey="impressions" name="Impresiones" fill="#3366CC" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Banner */}
            <div className="rounded-xl bg-[#3366CC] p-6 flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-bold">Maximiza el alcance de tus anuncios</h3>
                <p className="text-sm text-white/80 mt-1">
                  Nuestros algoritmos sugieren un ajuste en el presupuesto de keywords para campañas de &quot;ofertas&quot; para capturar 15% más impresiones.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-6">
                <Button className="bg-white text-[#3366CC] hover:bg-white/90 font-semibold">
                  Optimizar Ahora
                </Button>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                  Ignorar
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Distribución por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <div className="h-[250px] w-[250px] shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channelBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="percentage"
                          >
                            {channelBreakdown.map((entry) => (
                              <Cell key={entry.channel} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                            formatter={(value, _name, props) => [
                              `${value}% (${(props.payload as typeof channelBreakdown[number]).impressions.toLocaleString()})`,
                              (props.payload as typeof channelBreakdown[number]).label,
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-4">
                      {channelBreakdown.map((ch) => (
                        <div key={ch.channel} className="flex items-center gap-3">
                          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: ch.color }} />
                          <div>
                            <p className="text-sm font-medium">{ch.label}</p>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {ch.percentage}% · {ch.impressions.toLocaleString()} impresiones
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    Impresiones por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={channelBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        <Bar dataKey="impressions" name="Impresiones" radius={[4, 4, 0, 0]}>
                          {channelBreakdown.map((entry) => (
                            <Cell key={entry.channel} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rendimiento Detallado por Canal */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    Rendimiento Detallado por Canal
                  </CardTitle>
                  <a href="#" className="text-xs text-primary hover:underline">Exportar Reporte</a>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Canal</th>
                      <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Modelo de Entrega</th>
                      <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Impresiones</th>
                      <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">CTR</th>
                      <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Revenue</th>
                      <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/30">
                      <td className="px-6 py-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#3366CC]" />WhatsApp Business</td>
                      <td className="px-6 py-3 text-muted-foreground">14,238</td>
                      <td className="px-6 py-3 text-right tabular-nums">12,862</td>
                      <td className="px-6 py-3 text-right tabular-nums">4.5%</td>
                      <td className="px-6 py-3 text-right tabular-nums">$42</td>
                      <td className="px-6 py-3"><span className="inline-flex items-center gap-1 text-xs text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Activo</span></td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30">
                      <td className="px-6 py-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#60A5FA]" />Web Dashboard</td>
                      <td className="px-6 py-3 text-muted-foreground">5,509</td>
                      <td className="px-6 py-3 text-right tabular-nums">4,618</td>
                      <td className="px-6 py-3 text-right tabular-nums">4.2%</td>
                      <td className="px-6 py-3 text-right tabular-nums">$96</td>
                      <td className="px-6 py-3"><span className="inline-flex items-center gap-1 text-xs text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Activo</span></td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-6 py-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#94A3B8]" />Voz Automática</td>
                      <td className="px-6 py-3 text-muted-foreground">2,188</td>
                      <td className="px-6 py-3 text-right tabular-nums">1,488</td>
                      <td className="px-6 py-3 text-right tabular-nums">4.1%</td>
                      <td className="px-6 py-3 text-right tabular-nums">$9</td>
                      <td className="px-6 py-3"><span className="inline-flex items-center gap-1 text-xs text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Activo</span></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Section: Channel Distribution + Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Channel Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Distribución por Canal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channelDistribution.map((ch) => (
              <div key={ch.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{ch.name}</span>
                  <span className="font-medium tabular-nums">{ch.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right: Performance Alerts */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Alertas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.title} className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${alert.iconBg}`}>
                    <Icon className={`h-4 w-4 ${alert.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{alert.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
