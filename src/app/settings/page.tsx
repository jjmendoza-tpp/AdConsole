"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Key, Globe, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajustes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configuración general de la plataforma.
        </p>
      </div>

      {/* General */}
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
              <Input defaultValue="Shop.PR Ad Console" />
            </div>
            <div className="space-y-2">
              <Label>Zona Horaria</Label>
              <Input defaultValue="America/Puerto_Rico (AST)" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Input defaultValue="USD ($)" disabled />
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
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
              <Input defaultValue="tenant-shoppr" disabled className="font-mono text-sm" />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>API Key (Producción)</Label>
            <div className="flex gap-2">
              <Input defaultValue="sk-live-••••••••••••••••••••3f7a" disabled className="font-mono text-sm" />
              <Button variant="outline" size="icon">
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
            <Button variant="outline" size="sm">Configurar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
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
            <Switch checked onCheckedChange={() => {}} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Presupuesto agotado</p>
              <p className="text-xs text-muted-foreground">Alertar cuando una campaña gasta su presupuesto</p>
            </div>
            <Switch checked onCheckedChange={() => {}} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Reporte semanal</p>
              <p className="text-xs text-muted-foreground">Enviar resumen semanal por email</p>
            </div>
            <Switch onCheckedChange={() => {}} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
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
            <Button variant="outline" size="sm">Activar</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sesiones activas</p>
              <p className="text-xs text-muted-foreground">1 sesión activa desde San Juan, PR</p>
            </div>
            <Button variant="outline" size="sm">Ver sesiones</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button>Guardar Cambios</Button>
      </div>
    </div>
  );
}
