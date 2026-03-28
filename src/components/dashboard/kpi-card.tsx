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
    <Card className="card-hover">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">
            {kpi.label}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {kpi.changePercent.toFixed(1)}%
          </span>
        </div>
        <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
          {formatValue(kpi.value, kpi.format)}
        </span>
        <p className="mt-1.5 text-xs text-muted-foreground">
          vs. periodo anterior
        </p>
      </CardContent>
    </Card>
  );
}
