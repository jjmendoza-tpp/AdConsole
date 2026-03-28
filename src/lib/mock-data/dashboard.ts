import { DashboardKPI, RevenueDataPoint, ChannelBreakdown } from "@/lib/types";

export const dashboardKPIs: DashboardKPI[] = [
  {
    label: "Revenue Total",
    value: 12450,
    previousValue: 11067,
    format: "currency",
    trend: "up",
    changePercent: 12.5,
  },
  {
    label: "Campanas Activas",
    value: 24,
    previousValue: 23,
    format: "number",
    trend: "up",
    changePercent: 4.2,
  },
  {
    label: "Impresiones Hoy",
    value: 18432,
    previousValue: 17046,
    format: "number",
    trend: "up",
    changePercent: 8.1,
  },
  {
    label: "CTR Promedio",
    value: 3.2,
    previousValue: 3.34,
    format: "percentage",
    trend: "down",
    changePercent: 0.4,
  },
];

// 30 días de datos de revenue con tendencia ascendente
function generateRevenueData(): RevenueDataPoint[] {
  const data: RevenueDataPoint[] = [];
  const baseDate = new Date("2026-02-21");

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Tendencia ascendente con variación diaria
    const baseRevenue = 280 + i * 8;
    const variation = (Math.sin(i * 0.8) * 60) + (isWeekend ? -40 : 30);
    const revenue = Math.round(baseRevenue + variation);

    const baseImpressions = 12000 + i * 300;
    const impressionVariation = Math.round(Math.sin(i * 0.6) * 2000) + (isWeekend ? -1500 : 1000);
    const impressions = baseImpressions + impressionVariation;

    const ctr = 3.5 + Math.random() * 2.5;
    const clicks = Math.round(impressions * (ctr / 100));

    data.push({
      date: date.toISOString().split("T")[0],
      revenue,
      impressions,
      clicks,
    });
  }

  return data;
}

export const revenueData: RevenueDataPoint[] = generateRevenueData();

export const channelBreakdown: ChannelBreakdown[] = [
  {
    channel: "whatsapp",
    label: "WhatsApp",
    impressions: 119881,
    percentage: 65,
    color: "#25D366",
  },
  {
    channel: "web",
    label: "Web Chat",
    impressions: 46108,
    percentage: 25,
    color: "#3366CC",
  },
  {
    channel: "voice",
    label: "Voz",
    impressions: 14754,
    percentage: 8,
    color: "#8B5CF6",
  },
  {
    channel: "telegram",
    label: "Telegram",
    impressions: 3688,
    percentage: 2,
    color: "#0088cc",
  },
];
