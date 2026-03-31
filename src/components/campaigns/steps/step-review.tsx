"use client";

import { Badge } from "@/components/ui/badge";
import type { AdSpace, Advertiser } from "@/lib/types";
import type { WizardData } from "../wizard-shell";
import {
  Calendar,
  DollarSign,
  Target,
  MessageSquare,
  Globe,
  Mic,
  Send,
  Zap,
} from "lucide-react";

interface StepReviewProps {
  adSpaces: AdSpace[];
  advertisers: Advertiser[];
  data: WizardData;
}

const channelIcons: Record<string, React.ElementType> = {
  whatsapp: MessageSquare,
  web: Globe,
  voice: Mic,
  telegram: Send,
};

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  web: "Web Chat",
  voice: "Voz",
  telegram: "Telegram",
};

const intentLabels: Record<string, string> = {
  product_search: "Búsqueda de producto",
  price_comparison: "Comparación de precios",
  brand_inquiry: "Consulta de marca",
  general_info: "Información general",
};

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function StepReview({ adSpaces, advertisers, data }: StepReviewProps) {
  const advertiser = advertisers.find((a) => a.id === data.advertiserId);
  const adSpace = adSpaces.find((s) => s.id === data.adSpaceId);
  const estimatedImpressions =
    data.totalBudgetCents > 0 && data.costPerImpressionCents > 0
      ? Math.floor(data.totalBudgetCents / data.costPerImpressionCents)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Revisión Final
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Verifica que todo esté correcto antes de lanzar tu campaña.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Información básica */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Zap className="h-4 w-4 text-primary" />
            Información Básica
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Nombre</span>
              <p className="font-medium">{data.name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Anunciante</span>
              <p className="font-medium">{advertiser?.name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Espacio</span>
              <p className="font-medium">{adSpace?.name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fechas</span>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {data.startDate || "—"} → {data.endDate || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Targeting */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Target className="h-4 w-4 text-primary" />
            Targeting
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Palabras clave</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.keywords.length > 0
                  ? data.keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">
                        {kw}
                      </Badge>
                    ))
                  : <span className="text-muted-foreground">—</span>}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Intenciones</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.intents.length > 0
                  ? data.intents.map((i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {intentLabels[i] || i}
                      </Badge>
                    ))
                  : <span className="text-muted-foreground">—</span>}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Canales</span>
              <div className="flex gap-2 mt-1">
                {data.channels.length > 0
                  ? data.channels.map((ch) => {
                      const Icon = channelIcons[ch] || Globe;
                      return (
                        <div key={ch} className="flex items-center gap-1">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{channelLabels[ch] || ch}</span>
                        </div>
                      );
                    })
                  : <span className="text-muted-foreground">—</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Presupuesto */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <DollarSign className="h-4 w-4 text-primary" />
            Presupuesto
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Diario</span>
              <p className="font-medium tabular-nums">
                {formatCurrency(data.dailyBudgetCents)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Total</span>
              <p className="font-medium tabular-nums">
                {formatCurrency(data.totalBudgetCents)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Prioridad</span>
              <p className="font-medium tabular-nums">{data.priority}/100</p>
            </div>
            <div>
              <span className="text-muted-foreground">CPM</span>
              <p className="font-medium tabular-nums">
                {formatCurrency(data.costPerImpressionCents)}
              </p>
            </div>
          </div>
        </div>

        {/* Creativo */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            Creativo
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Mensaje</span>
              <p className="font-medium mt-1 rounded-md bg-muted/50 p-2 text-sm">
                {data.messageTemplate || "—"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground">URL</span>
                <p className="font-medium truncate">{data.ctaUrl || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Botón</span>
                <p className="font-medium">{data.buttonText || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimaciones */}
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-800 mb-2">
            Alcance Estimado
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-900 tabular-nums">
                {estimatedImpressions.toLocaleString()}
              </p>
              <p className="text-xs text-green-700">Impresiones</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900 tabular-nums">
                {Math.floor(estimatedImpressions * 0.035).toLocaleString()}
              </p>
              <p className="text-xs text-green-700">Clicks estimados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900 tabular-nums">
                3.5%
              </p>
              <p className="text-xs text-green-700">CTR esperado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
