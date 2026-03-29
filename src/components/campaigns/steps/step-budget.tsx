"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import type { WizardData } from "../wizard-shell";

interface StepBudgetProps {
  data: WizardData;
  onChange: (partial: Partial<WizardData>) => void;
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function StepBudget({ data, onChange }: StepBudgetProps) {
  const estimatedImpressions = data.totalBudgetCents > 0 && data.costPerImpressionCents > 0
    ? Math.floor(data.totalBudgetCents / data.costPerImpressionCents)
    : 0;

  const dailyDollars = data.dailyBudgetCents / 100;
  const cpmDollars = data.costPerImpressionCents / 100;
  const estimatedDailyReach = cpmDollars > 0
    ? Math.floor(dailyDollars / cpmDollars)
    : 0;

  const subtotal = data.totalBudgetCents / 100;
  const tax = subtotal * 0.115;
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Presupuesto</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configura cuánto invertir y la prioridad de tu campaña.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left: Sliders */}
        <div className="md:col-span-3 space-y-6">
          {/* Presupuesto diario */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Presupuesto Diario
              </Label>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatCurrency(data.dailyBudgetCents)}
              </span>
            </div>
            <Slider
              value={[data.dailyBudgetCents]}
              onValueChange={(vals) => onChange({ dailyBudgetCents: Array.isArray(vals) ? vals[0] : vals })}
              min={1000}
              max={100000}
              step={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$10</span>
              <span>$1,000</span>
            </div>
          </div>

          {/* Presupuesto total */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Presupuesto Total
              </Label>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatCurrency(data.totalBudgetCents)}
              </span>
            </div>
            <Slider
              value={[data.totalBudgetCents]}
              onValueChange={(vals) => onChange({ totalBudgetCents: Array.isArray(vals) ? vals[0] : vals })}
              min={10000}
              max={2000000}
              step={10000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$100</span>
              <span>$20,000</span>
            </div>
          </div>

          {/* Prioridad */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Prioridad de Entrega
              </Label>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {data.priority}/100
              </span>
            </div>
            <Slider
              value={[data.priority]}
              onValueChange={(vals) => onChange({ priority: Array.isArray(vals) ? vals[0] : vals })}
              min={1}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Baja</span>
              <span>Alta</span>
            </div>
          </div>

          {/* CPM */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Costo por Impresión (CPM)
            </Label>
            <p className="text-xs text-muted-foreground">
              Cuánto pagas por cada vez que se muestra tu anuncio.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                min={1}
                max={100}
                step={0.01}
                value={(data.costPerImpressionCents / 100).toFixed(2)}
                onChange={(e) =>
                  onChange({
                    costPerImpressionCents: Math.round(
                      parseFloat(e.target.value || "0") * 100
                    ),
                  })
                }
                className="w-28"
              />
              <span className="text-xs text-muted-foreground">por impresión</span>
            </div>
          </div>
        </div>

        {/* Right: Estimation Panel */}
        <div className="md:col-span-2">
          <Card className="bg-primary/5 border-primary/20 p-5 space-y-5">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <h4 className="text-sm font-semibold uppercase tracking-wider">Estimación</h4>
            </div>

            <p className="text-xs text-muted-foreground">
              Con un presupuesto diario de <span className="font-semibold text-foreground">{formatCurrency(data.dailyBudgetCents)}</span> y CPM de <span className="font-semibold text-foreground">{formatCurrency(data.costPerImpressionCents)}</span> se estiman ~<span className="font-semibold text-foreground">{estimatedDailyReach.toLocaleString()}</span> impresiones diarias.
            </p>

            <div className="text-center py-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Alcance Potencial
              </p>
              <p className="text-2xl font-bold tabular-nums text-foreground mt-1">
                {estimatedImpressions.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">pax</span>
              </p>
            </div>

            <div className="border-t border-primary/20 pt-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resumen Presupuesto
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Presupuesto</span>
                <span className="font-medium tabular-nums">${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (11.5%)</span>
                <span className="font-medium tabular-nums">${tax.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t border-primary/20 pt-2">
                <span>Total Estimado</span>
                <span className="tabular-nums">${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
