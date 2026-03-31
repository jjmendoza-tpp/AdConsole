import Link from "next/link";
import { AlertTriangle, ShieldAlert, DatabaseZap, Inbox, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type IntegrationStateVariant =
  | "loading"
  | "empty"
  | "unauthorized"
  | "tenantMissing"
  | "upstreamError";

const stateConfig = {
  loading: {
    icon: LoaderCircle,
    title: "Cargando datos",
    description: "Estamos preparando la información del prototipo.",
    iconClassName: "animate-spin text-primary",
  },
  empty: {
    icon: Inbox,
    title: "Sin datos disponibles",
    description: "No hay información para mostrar todavía en este contexto.",
    iconClassName: "text-muted-foreground",
  },
  unauthorized: {
    icon: ShieldAlert,
    title: "Acceso no autorizado",
    description: "La sesión actual no tiene permisos para consultar este recurso.",
    iconClassName: "text-amber-600",
  },
  tenantMissing: {
    icon: AlertTriangle,
    title: "Tenant no resuelto",
    description: "El contexto multi-tenant no está disponible para esta vista.",
    iconClassName: "text-amber-600",
  },
  upstreamError: {
    icon: DatabaseZap,
    title: "Servicio upstream no disponible",
    description: "La capa de datos no pudo completar la consulta requerida.",
    iconClassName: "text-red-600",
  },
} as const;

interface IntegrationStateProps {
  variant: IntegrationStateVariant;
  actionHref?: string;
  actionLabel?: string;
}

export function IntegrationState({
  variant,
  actionHref,
  actionLabel,
}: IntegrationStateProps) {
  const config = stateConfig[variant];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className={`h-6 w-6 ${config.iconClassName}`} />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">{config.title}</h2>
        <p className="max-w-md text-sm text-muted-foreground">{config.description}</p>
      </div>
      {actionHref && actionLabel ? (
        <Button render={<Link href={actionHref} />} variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
