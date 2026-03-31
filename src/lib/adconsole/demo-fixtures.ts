export interface AnalyticsInventoryItem {
  name: string;
  percentage: number;
  color: string;
}

export interface AnalyticsAlertItem {
  kind: "performance" | "budget" | "keywords";
  title: string;
  description: string;
  time: string;
}

export const analyticsInventoryMix: AnalyticsInventoryItem[] = [
  { name: "Búsqueda", percentage: 65, color: "#3366CC" },
  { name: "Display", percentage: 25, color: "#22c55e" },
  { name: "Retargeting", percentage: 10, color: "#eab308" },
];

export const analyticsAlerts: AnalyticsAlertItem[] = [
  {
    kind: "performance",
    title: "Campaña 'Venta Otoño' superó KPI",
    description: "Incremento del 15% en conversiones durante las últimas 24 horas.",
    time: "Hace 2h",
  },
  {
    kind: "budget",
    title: "Presupuesto Próximo a Agotarse",
    description: "Anunciante 'Medalla Light' ha consumido el 90% de su presupuesto diario.",
    time: "Hace 5h",
  },
  {
    kind: "keywords",
    title: "Nuevos Insights de Keywords",
    description: "Keyword 'Café Premium PR' muestra alta intención de compra esta semana.",
    time: "Ayer",
  },
];

export const advertiserAnnualRevenueSeries = [
  { month: "Ene", revenue: 1800 },
  { month: "Feb", revenue: 2200 },
  { month: "Mar", revenue: 2800 },
  { month: "Abr", revenue: 2400 },
  { month: "May", revenue: 3200 },
  { month: "Jun", revenue: 3800 },
  { month: "Jul", revenue: 3100 },
  { month: "Ago", revenue: 3600 },
  { month: "Sep", revenue: 4200 },
  { month: "Oct", revenue: 4800 },
  { month: "Nov", revenue: 5100 },
  { month: "Dic", revenue: 4400 },
];

const campaignPerformanceMultipliers = [
  0.72,
  0.8,
  0.76,
  0.88,
  0.94,
  0.9,
  0.98,
  1.02,
  1.08,
  1.04,
  1.1,
  1.16,
  1.12,
  1.2,
];

export function buildCampaignPerformanceSeries(
  totalImpressions: number,
  totalClicks: number,
) {
  const days = campaignPerformanceMultipliers.length;
  const baseImpressions = Math.floor(totalImpressions / days);
  const baseClicks = Math.floor(totalClicks / days);

  return campaignPerformanceMultipliers.map((multiplier, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));

    return {
      date: date.toLocaleDateString("es", { day: "numeric", month: "short" }),
      impressions: Math.floor(baseImpressions * multiplier),
      clicks: Math.floor(baseClicks * multiplier),
    };
  });
}
