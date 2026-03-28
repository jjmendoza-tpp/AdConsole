import { Badge } from "@/components/ui/badge";
import type { CampaignStatus } from "@/lib/types";

const statusConfig: Record<
  CampaignStatus | "active" | "inactive" | "suspended",
  { label: string; dotColor: string; className: string }
> = {
  active: {
    label: "Activo",
    dotColor: "bg-[#22C55E]",
    className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  },
  paused: {
    label: "Pausado",
    dotColor: "bg-[#EAB308]",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
  },
  draft: {
    label: "Borrador",
    dotColor: "bg-[#6B7280]",
    className: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
  },
  completed: {
    label: "Completado",
    dotColor: "bg-[#3366CC]",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  },
  cancelled: {
    label: "Cancelado",
    dotColor: "bg-[#EF4444]",
    className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  },
  inactive: {
    label: "Inactivo",
    dotColor: "bg-[#6B7280]",
    className: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
  },
  suspended: {
    label: "Suspendido",
    dotColor: "bg-[#EF4444]",
    className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  },
};

export function StatusBadge({
  status,
}: {
  status: CampaignStatus | "active" | "inactive" | "suspended";
}) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant="outline" className={config.className}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </Badge>
  );
}
