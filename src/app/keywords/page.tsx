"use client";

import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import { keywords } from "@/lib/mock-data";

const trendConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  up: { icon: TrendingUp, label: "Subiendo", className: "text-green-600" },
  down: { icon: TrendingDown, label: "Bajando", className: "text-red-500" },
  stable: { icon: Minus, label: "Estable", className: "text-muted-foreground" },
};

export default function KeywordsPage() {
  const sorted = [...keywords].sort((a, b) => b.volume - a.volume);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Keywords</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Palabras clave del mercado con volumen de búsqueda y actividad publicitaria.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar keywords..." className="pl-9" />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead className="text-right">Volumen</TableHead>
              <TableHead className="text-right">Campañas Activas</TableHead>
              <TableHead className="text-right">CPM Promedio</TableHead>
              <TableHead>Tendencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((kw) => {
              const trend = trendConfig[kw.trend] || trendConfig.stable;
              const TrendIcon = trend.icon;
              return (
                <TableRow key={kw.id}>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {kw.keyword}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {kw.volume.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {kw.activeCampaigns > 0 ? (
                      <span className="text-primary font-medium">{kw.activeCampaigns}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${(kw.avgCpm / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1.5 ${trend.className}`}>
                      <TrendIcon className="h-3.5 w-3.5" />
                      <span className="text-xs">{trend.label}</span>
                    </div>
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
