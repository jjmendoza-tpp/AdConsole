"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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

  const estimatedDays = data.dailyBudgetCents > 0
    ? Math.ceil(data.totalBudgetCents / data.dailyBudgetCents)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Presupuesto</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Configura cuánto invertir y la prioridad de tu campaña.
        </p>
      </div>

      {/* Presupuesto diario */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Presupuesto Diario</Label>
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
          <Label>Presupuesto Total</Label>
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
          <Label>Prioridad</Label>
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
        <p className="text-xs text-muted-foreground">
          Campañas con mayor prioridad se muestran primero cuando hay múltiples candidatas.
        </p>
      </div>

      {/* CPM */}
      <div className="space-y-2">
        <Label htmlFor="cpm">
          Costo por Impresión (CPM)
        </Label>
        <p className="text-xs text-muted-foreground">
          Cuánto pagas por cada vez que se muestra tu anuncio.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">$</span>
          <Input
            id="cpm"
            type="number"
            min={1}
            max={100}
            step={1}
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

      {/* Estimaciones */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h4 className="text-sm font-medium text-primary mb-3">
          Estimacion de alcance
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-primary/70">Impresiones estimadas</p>
            <p className="text-lg font-bold text-foreground tabular-nums">
              {estimatedImpressions.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-primary/70">Duracion estimada</p>
            <p className="text-lg font-bold text-foreground tabular-nums">
              {estimatedDays} dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
