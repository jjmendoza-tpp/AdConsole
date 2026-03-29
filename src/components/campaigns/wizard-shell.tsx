"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Shield, Sparkles, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StepBasicInfo } from "./steps/step-basic-info";
import { StepTargeting } from "./steps/step-targeting";
import { StepBudget } from "./steps/step-budget";
import { StepCreative } from "./steps/step-creative";
import { StepReview } from "./steps/step-review";
import type { Channel, Intent } from "@/lib/types";

export interface WizardData {
  // Step 1 — Basic Info
  name: string;
  advertiserId: string;
  adSpaceId: string;
  startDate: string;
  endDate: string;
  // Step 2 — Targeting
  keywords: string[];
  intents: Intent[];
  channels: Channel[];
  // Step 3 — Budget
  dailyBudgetCents: number;
  totalBudgetCents: number;
  priority: number;
  costPerImpressionCents: number;
  // Step 4 — Creative
  messageTemplate: string;
  ctaUrl: string;
  buttonText: string;
}

const initialData: WizardData = {
  name: "",
  advertiserId: "",
  adSpaceId: "",
  startDate: "",
  endDate: "",
  keywords: [],
  intents: [],
  channels: [],
  dailyBudgetCents: 15000,
  totalBudgetCents: 300000,
  priority: 50,
  costPerImpressionCents: 12,
  messageTemplate: "",
  ctaUrl: "",
  buttonText: "Ver oferta",
};

const steps = [
  { number: 1, title: "Info Básica", description: "Nombre, anunciante y fechas" },
  { number: 2, title: "Targeting", description: "Palabras clave y canales" },
  { number: 3, title: "Presupuesto", description: "Budget y prioridad" },
  { number: 4, title: "Creativo", description: "Mensaje y vista previa" },
  { number: 5, title: "Revisión", description: "Confirmar y lanzar" },
];

export function WizardShell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [launched, setLaunched] = useState(false);

  function updateData(partial: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    if (currentStep < 5) setCurrentStep((s) => s + 1);
  }

  function prev() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  function handleLaunch() {
    setLaunched(true);
  }

  if (launched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="relative animate-in zoom-in-50 duration-500">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]">
              <Check className="h-8 w-8 text-white stroke-[3]" />
            </div>
          </div>
        </div>
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h2 className="text-2xl font-bold text-foreground">
            Campaña Lanzada
          </h2>
          <p className="text-muted-foreground max-w-md">
            Tu campaña <span className="font-semibold text-foreground">{data.name || "Verano Medalla 2026"}</span> está activa y comenzará a servir impresiones.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg animate-in fade-in duration-500 delay-300">
          <Card className="p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estado</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              <span className="text-sm font-medium">Activa</span>
            </div>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Presupuesto Diario</p>
            <p className="text-sm font-bold tabular-nums mt-1">$250.00</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Audiencia Est.</p>
            <p className="text-sm font-bold tabular-nums mt-1">1.2M+</p>
          </Card>
        </div>
        <div className="flex gap-3 animate-in fade-in duration-500 delay-500">
          <Button variant="outline" onClick={() => { setLaunched(false); setCurrentStep(1); setData(initialData); }}>
            Crear otra campaña
          </Button>
          <Button render={<Link href="/campaigns" />}>
            Ver campañas
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Las métricas de rendimiento comenzarán a aparecer en 24 horas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Crear Nueva Campaña
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configura los detalles básicos para comenzar tu estrategia publicitaria.
        </p>
      </div>

      {/* Horizontal Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <button
                onClick={() => {
                  if (isCompleted) setCurrentStep(step.number);
                }}
                disabled={!isCompleted && !isCurrent}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "bg-[#22C55E] text-white cursor-pointer"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium uppercase tracking-wider ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 mt-[-18px] ${
                    currentStep > step.number
                      ? "bg-[#22C55E]"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        {currentStep === 1 && (
          <StepBasicInfo data={data} onChange={updateData} />
        )}
        {currentStep === 2 && (
          <StepTargeting data={data} onChange={updateData} />
        )}
        {currentStep === 3 && (
          <StepBudget data={data} onChange={updateData} />
        )}
        {currentStep === 4 && (
          <StepCreative data={data} onChange={updateData} />
        )}
        {currentStep === 5 && (
          <StepReview data={data} />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={prev}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          <div className="flex items-center gap-3">
            {currentStep === 3 && (
              <Button variant="outline" size="sm">
                Guardar Borrador
              </Button>
            )}
            {currentStep < 5 ? (
              <Button onClick={next}>
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleLaunch}
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white"
              >
                Lanzar Campaña
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Optimization Tip */}
      {currentStep <= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex items-start gap-4 rounded-xl bg-primary/5 border border-primary/20 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Consejo de Optimización</p>
              <p className="text-xs text-muted-foreground mt-1">
                Las campañas de &quot;Recomendación de Producto&quot; tienen un CTR un 24% mayor cuando se lanzan con al menos 2 semanas de anticipación a eventos festivos.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-border p-5 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Alcance Estimado</p>
            <p className="text-3xl font-bold tabular-nums text-foreground mt-1">450k+</p>
            <p className="text-xs text-[#22C55E] font-medium mt-1">Óptimo</p>
          </div>
        </div>
      )}

      {/* Bottom hint bar */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          Datos Seguros
        </span>
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Optimización IA
        </span>
        <span className="flex items-center gap-1.5">
          <CloudUpload className="h-3.5 w-3.5" />
          Guardado Automático
        </span>
      </div>
    </div>
  );
}
