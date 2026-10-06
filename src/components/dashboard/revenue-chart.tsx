"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";
import type { RevenueDataPoint } from "@/lib/types";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { downloadCsv } = useAdConsoleApp();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString("es", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <Card className="rounded-xl border-slate-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold tracking-tight">
          Revenue — Ultimos 30 dias
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md border-transparent bg-slate-100 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            onClick={() =>
              downloadCsv(
                "dashboard-revenue.csv",
                data.map((point) => ({
                  date: point.date,
                  revenue: point.revenue,
                  impressions: point.impressions,
                  clicks: point.clicks,
                })),
              )
            }
          >
            Exportar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md border-transparent bg-[#EBF0FF] px-3 text-xs font-semibold text-primary hover:bg-[#dfe7ff]"
            onClick={() => setDetailsOpen(true)}
          >
            Detalles
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] rounded-lg bg-slate-50 px-2 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 12, right: 14, left: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3366CC" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3366CC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#cbd5e1"
                strokeOpacity={0.75}
              />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 24px -12px rgb(15 23 42 / 0.25)",
                }}
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                labelFormatter={(label) => label}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3366CC"
                strokeWidth={3}
                fill="url(#fillRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Detalle de revenue</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Resumen ejecutivo de los últimos 30 días para uso comercial y operativo.
            </p>
            <div className="rounded-lg border bg-muted/20 p-4">
              <p>Revenue acumulado: ${data.reduce((sum, point) => sum + point.revenue, 0).toLocaleString()}</p>
              <p>Impresiones acumuladas: {data.reduce((sum, point) => sum + point.impressions, 0).toLocaleString()}</p>
              <p>Clicks acumulados: {data.reduce((sum, point) => sum + point.clicks, 0).toLocaleString()}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Cerrar
            </Button>
            <Button
              onClick={() =>
                downloadCsv(
                  "dashboard-revenue-detail.csv",
                  data.map((point) => ({
                    date: point.date,
                    revenue: point.revenue,
                    impressions: point.impressions,
                    clicks: point.clicks,
                  })),
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
