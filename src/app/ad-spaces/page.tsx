"use client";

import { useState } from "react";
import { LayoutGrid, MessageSquare, Globe, Mic, Send, Clock, Layers, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adSpaces } from "@/lib/mock-data";

const spaceTypeLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  product_recommendation: { label: "Recomendación de Producto", icon: Zap, color: "bg-blue-100 text-blue-700" },
  sponsored_tip: { label: "Tip Patrocinado", icon: Layers, color: "bg-purple-100 text-purple-700" },
  brand_mention: { label: "Mención de Marca", icon: LayoutGrid, color: "bg-amber-100 text-amber-700" },
};

const channelIcons: Record<string, React.ElementType> = {
  whatsapp: MessageSquare,
  web: Globe,
  voice: Mic,
  telegram: Send,
};

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  web: "Web",
  voice: "Voz",
  telegram: "Telegram",
};

export default function AdSpacesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Espacios Publicitarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configura los tipos de espacios donde se muestran anuncios dentro de las conversaciones.
        </p>
      </div>

      <div className="grid gap-4">
        {adSpaces.map((space) => {
          const typeConfig = spaceTypeLabels[space.spaceType] || spaceTypeLabels.product_recommendation;
          const TypeIcon = typeConfig.icon;
          const isEditing = editingId === space.id;

          return (
            <Card key={space.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${typeConfig.color}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {space.name}
                      </CardTitle>
                      <Badge variant="outline" className={`text-xs mt-1 ${typeConfig.color}`}>
                        {typeConfig.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {space.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                      <Switch
                        checked={space.status === "active"}
                        onCheckedChange={() => {}}
                      />
                    </div>
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
                  {/* Channels */}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Canales
                    </span>
                    <div className="flex gap-2 mt-2">
                      {space.channelFilter.map((ch) => {
                        const Icon = channelIcons[ch] || Globe;
                        return (
                          <div
                            key={ch}
                            className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1"
                          >
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs">{channelLabels[ch] || ch}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Max Ads */}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Máx. por Conversación
                    </span>
                    <p className="mt-2 text-lg font-semibold tabular-nums">
                      {space.maxAdsPerConversation}
                    </p>
                  </div>

                  {/* Cooldown */}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Cooldown
                    </span>
                    <p className="mt-2 text-lg font-semibold tabular-nums flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {space.cooldownMinutes} min
                    </p>
                  </div>
                </div>

                {/* Editable fields */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input defaultValue={space.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Máx. Anuncios por Conversación</Label>
                        <Input type="number" defaultValue={space.maxAdsPerConversation} min={1} max={10} />
                      </div>
                      <div className="space-y-2">
                        <Label>Cooldown (minutos)</Label>
                        <Input type="number" defaultValue={space.cooldownMinutes} min={1} max={1440} />
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
    </div>
  );
}
