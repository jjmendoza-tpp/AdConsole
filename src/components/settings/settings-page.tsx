"use client";

import { useState } from "react";
import { Bell, Copy, Globe, Key, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";

export function SettingsPageClient() {
  const {
    copyToClipboard,
    openHelp,
    pushFeedback,
    saveSettings,
    settings,
  } = useAdConsoleApp();
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [platformName, setPlatformName] = useState(settings.platformName);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajustes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configuración general de la plataforma.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">General</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre de la Plataforma</Label>
              <Input
                value={platformName}
                onChange={(event) => setPlatformName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zona Horaria</Label>
              <Input value={settings.timezone} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Input value={settings.currency} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">API Keys</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tenant ID</Label>
            <div className="flex gap-2">
              <Input value={settings.tenantId} disabled className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(settings.tenantId, "Tenant ID copiado")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>API Key (Producción)</Label>
            <div className="flex gap-2">
              <Input value={settings.apiKey} disabled className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(settings.apiKey, "API Key copiada")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Webhook URL</p>
              <p className="text-xs text-muted-foreground">
                Recibe notificaciones cuando se sirve una impresión o click.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setWebhookOpen(true)}>
              {settings.webhookConfigured ? "Editar" : "Configurar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Notificaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Campaña lanzada</p>
              <p className="text-xs text-muted-foreground">Notificar cuando se lanza una campaña</p>
            </div>
            <Switch
              checked={settings.notifications.campaignLaunched}
              onCheckedChange={(checked) =>
                saveSettings({
                  notifications: {
                    ...settings.notifications,
                    campaignLaunched: checked,
                  },
                })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Presupuesto agotado</p>
              <p className="text-xs text-muted-foreground">Alertar cuando una campaña gasta su presupuesto</p>
            </div>
            <Switch
              checked={settings.notifications.budgetDepleted}
              onCheckedChange={(checked) =>
                saveSettings({
                  notifications: {
                    ...settings.notifications,
                    budgetDepleted: checked,
                  },
                })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reporte semanal</p>
              <p className="text-xs text-muted-foreground">Enviar resumen semanal por email</p>
            </div>
            <Switch
              checked={settings.notifications.weeklyReport}
              onCheckedChange={(checked) =>
                saveSettings({
                  notifications: {
                    ...settings.notifications,
                    weeklyReport: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Seguridad</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Autenticación de dos factores</p>
              <p className="text-xs text-muted-foreground">Requiere código adicional al iniciar sesión</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                saveSettings({ twoFactorEnabled: !settings.twoFactorEnabled });
                pushFeedback(
                  settings.twoFactorEnabled
                    ? "Autenticación de dos factores desactivada."
                    : "Autenticación de dos factores activada.",
                );
              }}
            >
              {settings.twoFactorEnabled ? "Desactivar" : "Activar"}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sesiones activas</p>
              <p className="text-xs text-muted-foreground">{settings.activeSessionsLabel}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSessionsOpen(true)}>
              Ver sesiones
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" onClick={() => openHelp("/settings")}>
          Centro de Ayuda
        </Button>
        <Button
          onClick={() => {
            saveSettings({ platformName });
            pushFeedback("Configuración guardada.");
          }}
        >
          Guardar Cambios
        </Button>
      </div>

      <Dialog open={webhookOpen} onOpenChange={setWebhookOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Configurar webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="webhook-url">URL de webhook</Label>
            <Input
              id="webhook-url"
              defaultValue="https://hooks.shoppr.com/adconsole/events"
            />
            <p className="text-sm text-muted-foreground">
              Esta configuración es mock y persiste para la demo actual.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                saveSettings({ webhookConfigured: true });
                setWebhookOpen(false);
                pushFeedback("Webhook configurado para la demo.");
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sessionsOpen} onOpenChange={setSessionsOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Sesiones activas</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border px-4 py-3">
              <p className="font-medium">San Juan, PR</p>
              <p className="text-muted-foreground">Chrome · Última actividad hace 3 min</p>
            </div>
            <div className="rounded-lg border px-4 py-3">
              <p className="font-medium">Panel comercial</p>
              <p className="text-muted-foreground">Vista demo persistida por navegador</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSessionsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
