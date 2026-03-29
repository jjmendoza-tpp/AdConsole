"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { DashboardKPI } from "@/lib/types";

function formatValue(value: number, format: DashboardKPI["format"]): string {
  switch (format) {
    case "currency":
      return value >= 1000
        ? `$${(value / 1000).toFixed(1)}K`
        : `$${value.toLocaleString()}`;
    case "percentage":
      return `${value.toFixed(1)}%`;
    case "number":
      return value >= 1000
        ? `${(value / 1000).toFixed(1)}K`
        : value.toLocaleString();
  }
}

export function KPICard({ kpi }: { kpi: DashboardKPI }) {
  const isPositive = kpi.trend === "up";

  return (
    <Card className="card-hover border-slate-100 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isPositive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositive ? "+" : ""}
            {kpi.changePercent.toFixed(1)}%
          </span>
        </div>
        <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
          {formatValue(kpi.value, kpi.format)}
        </span>
        {typeof kpi.progressPercent === "number" ? (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${kpi.progressPercent}%` }}
            />
          </div>
        ) : (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {kpi.subtitle || "vs. periodo anterior"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
