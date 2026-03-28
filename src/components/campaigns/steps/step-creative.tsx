"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WizardData } from "../wizard-shell";

interface StepCreativeProps {
  data: WizardData;
  onChange: (partial: Partial<WizardData>) => void;
}

function renderTemplate(template: string): string {
  return template
    .replace(/\{\{product_name\}\}/g, "Medalla Light 12-pack")
    .replace(/\{\{price\}\}/g, "$12.99")
    .replace(/\{\{brand\}\}/g, "Medalla")
    .replace(/\{\{discount\}\}/g, "20%");
}

export function StepCreative({ data, onChange }: StepCreativeProps) {
  const previewText = renderTemplate(data.messageTemplate);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Creativo</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Diseña el mensaje que verán los usuarios. Usa variables como{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            {"{{product_name}}"}
          </code>{" "}
          y{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            {"{{price}}"}
          </code>{" "}
          para personalizar.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="message-template">Plantilla del Mensaje</Label>
            <Textarea
              id="message-template"
              rows={5}
              placeholder="Ej: ¡Prueba {{product_name}} a solo {{price}}! 🎉"
              value={data.messageTemplate}
              onChange={(e) => onChange({ messageTemplate: e.target.value })}
              className="resize-none"
            />
            <div className="flex flex-wrap gap-1.5">
              {["{{product_name}}", "{{price}}", "{{brand}}", "{{discount}}"].map(
                (variable) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() =>
                      onChange({
                        messageTemplate: data.messageTemplate + " " + variable,
                      })
                    }
                    className="rounded-md bg-muted px-2 py-1 text-xs font-mono text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    {variable}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta-url">URL de destino</Label>
            <Input
              id="cta-url"
              type="url"
              placeholder="https://shoppr.com/oferta"
              value={data.ctaUrl}
              onChange={(e) => onChange({ ctaUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="button-text">Texto del Botón</Label>
            <Input
              id="button-text"
              placeholder="Ver oferta"
              value={data.buttonText}
              onChange={(e) => onChange({ buttonText: e.target.value })}
            />
          </div>
        </div>

        {/* WhatsApp Preview — WOW factor */}
        <div className="space-y-2">
          <Label>Vista Previa — WhatsApp</Label>
          <div className="rounded-xl border border-border bg-[#e5ddd5] p-4 min-h-[320px]">
            {/* WhatsApp header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366] text-white text-xs font-bold">
                AI
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Shop.PR Asistente
                </p>
                <p className="text-[10px] text-gray-500">en línea</p>
              </div>
            </div>

            {/* Chat bubbles */}
            <div className="space-y-2">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-lg rounded-tr-none bg-[#dcf8c6] px-3 py-2 shadow-sm">
                  <p className="text-sm text-gray-900">
                    ¿Qué cerveza me recomiendas para la playa?
                  </p>
                  <p className="text-[10px] text-gray-500 text-right mt-1">
                    2:34 PM
                  </p>
                </div>
              </div>

              {/* AI response with ad */}
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 shadow-sm">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {previewText || (
                      <span className="text-gray-400 italic">
                        Escribe una plantilla para ver la vista previa...
                      </span>
                    )}
                  </p>
                  {data.ctaUrl && data.buttonText && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-center rounded-md bg-[#25d366]/10 py-1.5 text-[#075e54] text-sm font-medium">
                        {data.buttonText}
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-500 mt-1">2:34 PM</p>
                </div>
              </div>

              {/* Sponsored label */}
              {previewText && (
                <div className="flex justify-center">
                  <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] text-gray-500 shadow-sm">
                    Patrocinado
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
