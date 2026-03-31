import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { createAdConsoleRequestContext } from "@/lib/adconsole/config";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";

const trendConfig: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  up: { icon: TrendingUp, label: "Subiendo", className: "text-green-600" },
  down: { icon: TrendingDown, label: "Bajando", className: "text-red-500" },
  stable: { icon: Minus, label: "Estable", className: "text-muted-foreground" },
};

export default async function KeywordsPage() {
  const repository = getAdConsoleRepository(createAdConsoleRequestContext());
  const keywords = await repository.listKeywords();
  const sorted = [...keywords].sort((a, b) => b.volume - a.volume);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Keywords</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoreo y tendencias de palabras clave en el mercado de Puerto Rico
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Keywords</p>
            <p className="text-2xl font-bold mt-1">1,284</p>
            <div className="flex items-center gap-1 mt-1 text-green-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">+12%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Volumen Mensual</p>
            <p className="text-2xl font-bold mt-1">42.5k</p>
            <div className="flex items-center gap-1 mt-1 text-green-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">+8.4k</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">CPM Promedio</p>
            <p className="text-2xl font-bold mt-1">$2.45</p>
            <div className="flex items-center gap-1 mt-1 text-amber-500">
              <Minus className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">+0.2%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Campañas</p>
            <p className="text-2xl font-bold mt-1">56</p>
            <div className="flex items-center gap-1 mt-1 text-red-500">
              <TrendingDown className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">-4</span>
            </div>
          </CardContent>
        </Card>
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
        <div className="px-6 py-3 border-t text-sm text-muted-foreground">
          Mostrando 12 de 1,284 keywords
        </div>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AI Insight Card */}
        <Card className="md:col-span-2 bg-[#3366CC] text-white border-0">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Sugerencia de Inteligencia</h3>
            <p className="mt-2 text-sm text-white/90">
              Basado en las tendencias actuales en San Juan, las palabras clave relacionadas con
              &apos;Supermercado&apos; están viendo un incremento del 40% en volumen durante los
              fines de semana.
            </p>
            <button className="mt-4 bg-white text-[#3366CC] rounded-lg px-6 py-2 font-semibold">
              Crear Campaña
            </button>
          </CardContent>
        </Card>

        {/* Top Categories Card */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Top Categorías</h3>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Consumo Masivo</span>
                  <span className="font-medium">42%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-[#3366CC]" style={{ width: "42%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Finanzas</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-[#3366CC]" style={{ width: "28%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tecnología</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-[#3366CC]" style={{ width: "15%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
