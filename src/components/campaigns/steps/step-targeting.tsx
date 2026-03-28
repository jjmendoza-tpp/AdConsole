"use client";

import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/shared/tag-input";
import type { WizardData } from "../wizard-shell";
import type { Intent, Channel } from "@/lib/types";
import { MessageSquare, Globe, Mic, Send } from "lucide-react";

interface StepTargetingProps {
  data: WizardData;
  onChange: (partial: Partial<WizardData>) => void;
}

const intentOptions: { value: Intent; label: string; description: string }[] = [
  {
    value: "product_search",
    label: "Búsqueda de producto",
    description: "El usuario busca un producto específico",
  },
  {
    value: "price_comparison",
    label: "Comparación de precios",
    description: "El usuario compara opciones y precios",
  },
  {
    value: "brand_inquiry",
    label: "Consulta de marca",
    description: "El usuario pregunta por una marca",
  },
  {
    value: "general_info",
    label: "Información general",
    description: "Preguntas generales sobre productos o servicios",
  },
];

const channelOptions: {
  value: Channel;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "bg-green-100 text-green-700 border-green-200" },
  { value: "web", label: "Web Chat", icon: Globe, color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "voice", label: "Voz", icon: Mic, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "telegram", label: "Telegram", icon: Send, color: "bg-sky-100 text-sky-700 border-sky-200" },
];

const keywordSuggestions = [
  "cerveza", "arroz", "pan", "ofertas", "seguros", "banco",
  "supermercado", "restaurante", "pizza", "pollo", "café",
  "descuento", "envío gratis", "receta", "almuerzo",
];

export function StepTargeting({ data, onChange }: StepTargetingProps) {
  function toggleIntent(intent: Intent) {
    const exists = data.intents.includes(intent);
    onChange({
      intents: exists
        ? data.intents.filter((i) => i !== intent)
        : [...data.intents, intent],
    });
  }

  function toggleChannel(channel: Channel) {
    const exists = data.channels.includes(channel);
    onChange({
      channels: exists
        ? data.channels.filter((c) => c !== channel)
        : [...data.channels, channel],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Targeting</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Define cuándo y dónde se mostrará tu anuncio.
        </p>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label>Palabras Clave</Label>
        <p className="text-xs text-muted-foreground">
          Cuando un usuario mencione estas palabras, tu anuncio podrá aparecer.
        </p>
        <TagInput
          tags={data.keywords}
          onChange={(keywords) => onChange({ keywords })}
          placeholder="Escribe y presiona Enter..."
          suggestions={keywordSuggestions}
        />
      </div>

      {/* Intents */}
      <div className="space-y-3">
        <div>
          <Label>Intención del Usuario</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona en qué momento de la conversación mostrar el anuncio.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {intentOptions.map((option) => {
            const selected = data.intents.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleIntent(option.value)}
                className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  selected
                    ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    selected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Channels */}
      <div className="space-y-3">
        <div>
          <Label>Canales</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            En qué canales de comunicación se mostrará el anuncio.
          </p>
        </div>
        <div className="flex gap-2">
          {channelOptions.map((option) => {
            const selected = data.channels.includes(option.value);
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleChannel(option.value)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-colors ${
                  selected
                    ? `${option.color} border-current`
                    : "border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
