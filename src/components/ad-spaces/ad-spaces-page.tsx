"use client";

import { useState } from "react";
import {
  LayoutGrid,
  MessageSquare,
  Globe,
  Mic,
  Send,
  Clock,
  Layers,
  Zap,
  Cpu,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AdSpace } from "@/lib/types";

interface AdSpacesPageProps {
  adSpaces: AdSpace[];
}

const spaceTypeLabels: Record<string, { label: string; sublabel: string; icon: React.ElementType; color: string }> = {
  product_recommendation: { label: "Recomendación de Producto", sublabel: "SUGERIDO", icon: Zap, color: "bg-blue-100 text-blue-700" },
  sponsored_tip: { label: "Tip Patrocinado", sublabel: "INFORMATIVO", icon: Layers, color: "bg-purple-100 text-purple-700" },
  brand_mention: { label: "Mención de Marca", sublabel: "BRANDING", icon: LayoutGrid, color: "bg-amber-100 text-amber-700" },
};

const channelIcons: Record<string, React.ElementType> = {
  whatsapp: MessageSquare,
  web: Globe,
  voice: Mic,
  telegram: Send,
};

const channelLabels: Record<string, string> = {
  whatsapp: "WA",
  web: "Web",
  voice: "Voz",
  telegram: "TG",
};

export function AdSpacesPage({ adSpaces }: AdSpacesPageProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Espacios Publicitarios &gt; Detalle</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Espacio</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configura los parámetros de visualización para los anuncios.
        </p>
      </div>

      <div className="grid gap-4">
        {adSpaces.map((space) => {
          const typeConfig = spaceTypeLabels[space.spaceType] || spaceTypeLabels.product_recommendation;
          const TypeIcon = typeConfig.icon;
          const isEditing = editingId === space.id;

          return (
            <Card key={space.id} className={isEditing ? "border-primary/30" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.color}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-semibold">
                          {space.name}
                        </CardTitle>
                        <Badge variant="outline" className={`text-[10px] ${typeConfig.color}`}>
                          {typeConfig.sublabel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {space.status === "active" ? "ACTIVO" : "INACTIVO"}
                    </span>
                    <Switch
                      checked={space.status === "active"}
                      onCheckedChange={() => {}}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(isEditing ? null : space.id)}
                    >
                      {isEditing ? "Cerrar" : "Editar"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Canales
                    </span>
                    <div className="flex gap-2 mt-2">
                      {space.channelFilter.map((channel) => {
                        const Icon = channelIcons[channel] || Globe;
                        return (
                          <div
                            key={channel}
                            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1"
                          >
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs">{channelLabels[channel] || channel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      MaxConv
                    </span>
                    <p className="mt-2 text-lg font-semibold tabular-nums">
                      {space.maxAdsPerConversation}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Cooldown
                    </span>
                    <p className="mt-2 text-lg font-semibold tabular-nums flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {space.cooldownMinutes} min
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Nombre del Espacio
                        </Label>
                        <Input defaultValue={space.name} />
                        <p className="text-[10px] text-muted-foreground">Este nombre se mostrará en los reportes de anuncios.</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Max Anuncios por Conversación
                        </Label>
                        <Input type="number" defaultValue={space.maxAdsPerConversation} min={1} max={10} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Cooldown (Minutos)
                        </Label>
                        <Input type="number" defaultValue={space.cooldownMinutes} min={1} max={1440} />
                        <p className="text-[10px] text-muted-foreground">Tiempo mínimo antes de repetir la recomendación.</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={() => setEditingId(null)}>
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
          Otros Espacios Disponibles
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏷️</span>
              <div>
                <p className="text-sm font-medium">Banner Principal</p>
                <p className="text-xs text-muted-foreground">4 Activo · 1 Anuncio Activo</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">🎁</span>
              <div>
                <p className="text-sm font-medium">Oferta del Día</p>
                <p className="text-xs text-muted-foreground">1 Pausado · 0 Anuncios Activos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Cpu className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Optimización Automática</p>
              <p className="text-xs text-muted-foreground mt-1">
                Prometheus está ajustando los pujas para este espacio basándose en el historial de las últimas 24h.
              </p>
              <a href="#" className="text-xs text-primary font-medium mt-2 inline-block hover:underline">
                VER REPORTES IA
              </a>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Previsualización de Ubicación</p>
              <p className="text-xs text-muted-foreground mt-1">
                Este espacio aparece en la sección &quot;Te podría interesar&quot; del carrito de compras.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
        <p>Prometheus Digital Services - Shop.PR Console v1.4.2</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:underline">Documentación de API</a>
          <a href="#" className="hover:underline">Centro de Ayuda</a>
        </div>
      </div>
    </div>
  );
}
