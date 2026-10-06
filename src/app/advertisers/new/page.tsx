"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdConsoleApp } from "@/components/shell/adconsole-app-provider";
import type { AdvertiserFormValues } from "@/lib/adconsole/demo-runtime";

export default function NewAdvertiserPage() {
  const { createAdvertiser, getViewHref } = useAdConsoleApp();
  const [savedAdvertiserId, setSavedAdvertiserId] = useState<string | null>(null);
  const [form, setForm] = useState<AdvertiserFormValues>({
    name: "",
    companyName: "",
    taxId: "",
    contactName: "",
    email: "",
    phone: "",
    monthlyBudgetDollars: "",
    contractStart: "",
    contractEnd: "",
  });

  const isValid =
    form.name.trim().length > 0 &&
    form.contactName.trim().length > 0 &&
    form.email.trim().length > 0;

  function updateField<Key extends keyof AdvertiserFormValues>(
    key: Key,
    value: AdvertiserFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (savedAdvertiserId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-in zoom-in-50 duration-500">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h2 className="text-2xl font-bold text-foreground">
            Anunciante Creado
          </h2>
          <p className="text-muted-foreground max-w-md">
            El anunciante ha sido registrado exitosamente.
          </p>
        </div>
        <div className="flex gap-3 animate-in fade-in duration-500 delay-500">
          <Button
            variant="outline"
            onClick={() => {
              setSavedAdvertiserId(null);
              setForm({
                name: "",
                companyName: "",
                taxId: "",
                contactName: "",
                email: "",
                phone: "",
                monthlyBudgetDollars: "",
                contractStart: "",
                contractEnd: "",
              });
            }}
          >
            Crear otro
          </Button>
          <Button render={<Link href={getViewHref(`/advertisers/${savedAdvertiserId}`)} />}>
            Ver detalle
          </Button>
          <Button variant="outline" render={<Link href={getViewHref("/advertisers")} />}>
            Ver anunciantes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href={getViewHref("/advertisers")} />} variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Nuevo Anunciante
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registra un nuevo anunciante en la plataforma.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Anunciante</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Ej: Medalla Light"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Razón Social</Label>
              <Input
                id="company"
                value={form.companyName}
                onChange={(event) => updateField("companyName", event.target.value)}
                placeholder="Ej: Compañía Cervecera de PR"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-id">Tax ID</Label>
              <Input
                id="tax-id"
                value={form.taxId}
                onChange={(event) => updateField("taxId", event.target.value)}
                placeholder="Ej: 66-0123456"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Nombre de Contacto</Label>
            <Input
              id="contact-name"
              value={form.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
              placeholder="Ej: Carlos Rivera"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="contacto@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+1-787-555-0101"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget Mensual (USD)</Label>
            <Input
              id="budget"
              type="number"
              value={form.monthlyBudgetDollars}
              onChange={(event) => updateField("monthlyBudgetDollars", event.target.value)}
              placeholder="15000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract-start">Inicio de Contrato</Label>
              <Input
                id="contract-start"
                type="date"
                value={form.contractStart}
                onChange={(event) => updateField("contractStart", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contract-end">Fin de Contrato</Label>
              <Input
                id="contract-end"
                type="date"
                value={form.contractEnd}
                onChange={(event) => updateField("contractEnd", event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pb-8">
        <Button variant="outline" render={<Link href={getViewHref("/advertisers")} />}>
          Cancelar
        </Button>
        <Button
          disabled={!isValid}
          onClick={() => {
            const advertiser = createAdvertiser(form);
            setSavedAdvertiserId(advertiser.id);
          }}
        >
          Guardar Anunciante
        </Button>
      </div>
    </div>
  );
}
