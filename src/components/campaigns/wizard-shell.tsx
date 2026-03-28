"use client";

import { useState } from "react";
import { Check } from "lucide-react";
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
  { number: 1, title: "Información Básica", description: "Nombre, anunciante y fechas" },
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
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-in zoom-in-50 duration-500">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h2 className="text-2xl font-bold text-foreground">
            ¡Campaña Lanzada!
          </h2>
          <p className="text-muted-foreground max-w-md">
            &quot;{data.name}&quot; está activa y comenzará a servir anuncios según tu configuración.
          </p>
        </div>
        <div className="flex gap-3 animate-in fade-in duration-500 delay-500">
          <Button variant="outline" onClick={() => { setLaunched(false); setCurrentStep(1); setData(initialData); }}>
            Crear otra campaña
          </Button>
          <Button render={<a href="/campaigns" />}>
            Ver campañas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Stepper lateral */}
      <div className="w-64 shrink-0">
        <nav className="space-y-1">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <button
                key={step.number}
                onClick={() => {
                  if (isCompleted) setCurrentStep(step.number);
                }}
                disabled={!isCompleted && !isCurrent}
                className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors ${
                  isCurrent
                    ? "bg-primary/5 border border-primary/20"
                    : isCompleted
                    ? "hover:bg-muted/50 cursor-pointer"
                    : "opacity-50 cursor-default"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isCompleted
                      ? "bg-green-100 text-green-700"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido del paso */}
      <div className="flex-1 min-w-0">
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
            <span className="text-sm text-muted-foreground">
              Paso {currentStep} de {steps.length}
            </span>
            {currentStep < 5 ? (
              <Button onClick={next}>
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleLaunch}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Lanzar Campana
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
