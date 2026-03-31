"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdSpace, Advertiser } from "@/lib/types";
import type { WizardData } from "../wizard-shell";

interface StepBasicInfoProps {
  adSpaces: AdSpace[];
  advertisers: Advertiser[];
  data: WizardData;
  onChange: (partial: Partial<WizardData>) => void;
}

export function StepBasicInfo({
  adSpaces,
  advertisers,
  data,
  onChange,
}: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Información Básica
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Define el nombre, anunciante y fechas de tu campaña.
        </p>
      </div>

      <div className="grid gap-5">
        {/* Nombre de campaña */}
        <div className="space-y-2">
          <Label htmlFor="campaign-name">Nombre de la Campaña</Label>
          <Input
            id="campaign-name"
            placeholder="Ej: Verano Medalla 2026"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        {/* Anunciante */}
        <div className="space-y-2">
          <Label>Anunciante</Label>
          <Select
            value={data.advertiserId}
            onValueChange={(val) => onChange({ advertiserId: val as string })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un anunciante" />
            </SelectTrigger>
            <SelectContent>
              {advertisers
                .filter((a) => a.status === "active")
                .map((adv) => (
                  <SelectItem key={adv.id} value={adv.id}>
                    {adv.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Espacio publicitario */}
        <div className="space-y-2">
          <Label>Espacio Publicitario</Label>
          <Select
            value={data.adSpaceId}
            onValueChange={(val) => onChange({ adSpaceId: val as string })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un espacio" />
            </SelectTrigger>
            <SelectContent>
              {adSpaces
                .filter((s) => s.status === "active")
                .map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Fecha de Inicio</Label>
            <Input
              id="start-date"
              type="date"
              value={data.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Fecha de Fin</Label>
            <Input
              id="end-date"
              type="date"
              value={data.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
