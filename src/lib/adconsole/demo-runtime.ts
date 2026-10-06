import { advertisers as seedAdvertisers } from "@/lib/mock-data/advertisers";
import { adSpaces as seedAdSpaces } from "@/lib/mock-data/ad-spaces";
import { campaigns as seedCampaigns } from "@/lib/mock-data/campaigns";
import {
  channelBreakdown as seedChannelBreakdown,
  dashboardKPIs as seedDashboardKpis,
  revenueData as seedRevenueData,
} from "@/lib/mock-data/dashboard";
import { keywords as seedKeywords } from "@/lib/mock-data/keywords";
import type {
  AdSpace,
  Advertiser,
  Campaign,
  CampaignStatus,
  ChannelBreakdown,
  DashboardKPI,
  Intent,
  Keyword,
  RevenueDataPoint,
  Channel,
} from "@/lib/types";
import type { AdConsoleViewMode } from "./config";

export const ADCONSOLE_DEMO_STATE_KEY = "adconsole_demo_state";

export interface CampaignComposerData {
  name: string;
  advertiserId: string;
  adSpaceId: string;
  startDate: string;
  endDate: string;
  keywords: string[];
  intents: Intent[];
  channels: Channel[];
  dailyBudgetCents: number;
  totalBudgetCents: number;
  priority: number;
  costPerImpressionCents: number;
  messageTemplate: string;
  ctaUrl: string;
  buttonText: string;
}

export interface AdvertiserFormValues {
  name: string;
  companyName: string;
  taxId: string;
  contactName: string;
  email: string;
  phone: string;
  monthlyBudgetDollars: string;
  contractStart: string;
  contractEnd: string;
}

export interface DemoNotification {
  id: string;
  title: string;
  description: string;
  href: string;
  timeLabel: string;
  category: "campaign" | "budget" | "system" | "insight";
  read: boolean;
}

export interface DemoSettingsState {
  platformName: string;
  timezone: string;
  currency: string;
  tenantId: string;
  apiKey: string;
  webhookConfigured: boolean;
  twoFactorEnabled: boolean;
  activeSessionsLabel: string;
  notifications: {
    campaignLaunched: boolean;
    budgetDepleted: boolean;
    weeklyReport: boolean;
  };
}

export interface DemoPersistedState {
  notifications: DemoNotification[];
  recentSearches: string[];
  createdCampaigns: Campaign[];
  campaignOverrides: Record<string, Partial<Campaign>>;
  createdAdvertisers: Advertiser[];
  advertiserOverrides: Record<string, Partial<Advertiser>>;
  adSpaceOverrides: Record<string, Partial<AdSpace>>;
  settings: DemoSettingsState;
}

export interface DemoSearchResult {
  id: string;
  kind: "route" | "campaign" | "advertiser" | "keyword";
  title: string;
  subtitle: string;
  href: string;
}

export const defaultCampaignComposerData: CampaignComposerData = {
  name: "",
  advertiserId: "",
  adSpaceId: "",
  startDate: "",
  endDate: "",
  keywords: [],
  intents: [],
  channels: [],
  dailyBudgetCents: 15000,
  totalBudgetCents: 300000,
  priority: 50,
  costPerImpressionCents: 12,
  messageTemplate: "",
  ctaUrl: "",
  buttonText: "Ver oferta",
};

export const defaultDemoSettings: DemoSettingsState = {
  platformName: "Shop.PR Ad Console",
  timezone: "America/Puerto_Rico (AST)",
  currency: "USD ($)",
  tenantId: "tenant-shoppr",
  apiKey: "managed-upstream-in-flamerly",
  webhookConfigured: false,
  twoFactorEnabled: false,
  activeSessionsLabel: "1 sesión activa desde San Juan, PR",
  notifications: {
    campaignLaunched: true,
    budgetDepleted: true,
    weeklyReport: false,
  },
};

export const defaultDemoNotifications: DemoNotification[] = [
  {
    id: "notif-campaign-001",
    title: "Campaña lista para seguimiento",
    description: "Promo Medalla Light alcanzó 4.2K impresiones hoy.",
    href: "/campaigns/stitch-1",
    timeLabel: "Hace 4 min",
    category: "campaign",
    read: false,
  },
  {
    id: "notif-budget-001",
    title: "Presupuesto próximo a agotarse",
    description: "Walmart Ofertas Semanales consumió 90% del presupuesto diario.",
    href: "/campaigns/stitch-4",
    timeLabel: "Hace 18 min",
    category: "budget",
    read: false,
  },
  {
    id: "notif-insight-001",
    title: "Nuevo insight de analytics",
    description: "Canal WhatsApp generó el mayor CTR de la semana.",
    href: "/analytics",
    timeLabel: "Hoy",
    category: "insight",
    read: false,
  },
  {
    id: "notif-system-001",
    title: "Webhook pendiente de configuración",
    description: "Completa la URL de webhook para recibir eventos de impresiones.",
    href: "/settings",
    timeLabel: "Ayer",
    category: "system",
    read: true,
  },
];

export const demoRouteSearchEntries: Array<Omit<DemoSearchResult, "href"> & { path: string }> = [
  {
    id: "route-dashboard",
    kind: "route",
    title: "Dashboard",
    subtitle: "Resumen principal de rendimiento",
    path: "/",
  },
  {
    id: "route-campaigns",
    kind: "route",
    title: "Campañas",
    subtitle: "Lista, filtros y exportación",
    path: "/campaigns",
  },
  {
    id: "route-campaigns-new",
    kind: "route",
    title: "Nueva Campaña",
    subtitle: "Asistente de creación y borradores",
    path: "/campaigns/new",
  },
  {
    id: "route-advertisers",
    kind: "route",
    title: "Anunciantes",
    subtitle: "Gestión comercial y contactos",
    path: "/advertisers",
  },
  {
    id: "route-analytics",
    kind: "route",
    title: "Analytics",
    subtitle: "Reportes, exportes y alertas",
    path: "/analytics",
  },
  {
    id: "route-keywords",
    kind: "route",
    title: "Keywords",
    subtitle: "Intención y volumen",
    path: "/keywords",
  },
  {
    id: "route-ad-spaces",
    kind: "route",
    title: "Espacios",
    subtitle: "Solo administrador",
    path: "/ad-spaces",
  },
  {
    id: "route-settings",
    kind: "route",
    title: "Ajustes",
    subtitle: "Solo administrador",
    path: "/settings",
  },
];

export const emptyDemoPersistedState: DemoPersistedState = {
  notifications: defaultDemoNotifications,
  recentSearches: [],
  createdCampaigns: [],
  campaignOverrides: {},
  createdAdvertisers: [],
  advertiserOverrides: {},
  adSpaceOverrides: {},
  settings: defaultDemoSettings,
};

export function cloneSeedCampaigns(): Campaign[] {
  return structuredClone(seedCampaigns);
}

export function cloneSeedAdvertisers(): Advertiser[] {
  return structuredClone(seedAdvertisers);
}

export function cloneSeedAdSpaces(): AdSpace[] {
  return structuredClone(seedAdSpaces);
}

export function cloneSeedKeywords(): Keyword[] {
  return structuredClone(seedKeywords);
}

export function cloneSeedRevenueData(): RevenueDataPoint[] {
  return structuredClone(seedRevenueData);
}

export function cloneSeedChannelBreakdown(): ChannelBreakdown[] {
  return structuredClone(seedChannelBreakdown);
}

export function cloneSeedDashboardKpis(): DashboardKPI[] {
  return structuredClone(seedDashboardKpis);
}

function byUpdatedAtDesc<T extends { updatedAt?: string; createdAt?: string }>(
  left: T,
  right: T,
) {
  const leftDate = left.updatedAt ?? left.createdAt ?? "";
  const rightDate = right.updatedAt ?? right.createdAt ?? "";

  return leftDate < rightDate ? 1 : leftDate > rightDate ? -1 : 0;
}

export function mergeCampaigns(
  seed: Campaign[],
  state: DemoPersistedState,
): Campaign[] {
  const merged = new Map<string, Campaign>();

  for (const campaign of seed) {
    merged.set(campaign.id, {
      ...campaign,
      ...state.campaignOverrides[campaign.id],
    });
  }

  for (const campaign of state.createdCampaigns) {
    const override = state.campaignOverrides[campaign.id] ?? {};
    merged.set(campaign.id, { ...campaign, ...override });
  }

  return [...merged.values()].sort(byUpdatedAtDesc);
}

export function mergeAdvertisers(
  seed: Advertiser[],
  state: DemoPersistedState,
  campaigns: Campaign[],
): Advertiser[] {
  const merged = new Map<string, Advertiser>();

  for (const advertiser of seed) {
    merged.set(advertiser.id, {
      ...advertiser,
      ...state.advertiserOverrides[advertiser.id],
    });
  }

  for (const advertiser of state.createdAdvertisers) {
    const override = state.advertiserOverrides[advertiser.id] ?? {};
    merged.set(advertiser.id, { ...advertiser, ...override });
  }

  return [...merged.values()]
    .map((advertiser) => {
      const advertiserCampaigns = campaigns.filter(
        (campaign) => campaign.advertiserId === advertiser.id,
      );
      const activeCampaigns = advertiserCampaigns.filter(
        (campaign) => campaign.status === "active",
      ).length;
      const totalImpressions = advertiserCampaigns.reduce(
        (sum, campaign) => sum + campaign.totalImpressions,
        0,
      );
      const totalClicks = advertiserCampaigns.reduce(
        (sum, campaign) => sum + campaign.totalClicks,
        0,
      );

      return {
        ...advertiser,
        activeCampaigns,
        totalImpressions,
        totalClicks,
      };
    })
    .sort(byUpdatedAtDesc);
}

export function mergeAdSpaces(
  seed: AdSpace[],
  state: DemoPersistedState,
): AdSpace[] {
  return seed
    .map((space) => ({
      ...space,
      ...state.adSpaceOverrides[space.id],
    }))
    .sort(byUpdatedAtDesc);
}

export function buildViewHref(
  href: string,
  viewMode: AdConsoleViewMode,
): string {
  if (!href.startsWith("/")) {
    return href;
  }

  const url = new URL(href, "https://adconsole.local");
  url.searchParams.set("view", viewMode);

  return `${url.pathname}${url.search}${url.hash}`;
}

export function createCampaignFromComposer(
  data: CampaignComposerData,
  advertisers: Advertiser[],
  adSpaces: AdSpace[],
  options?: {
    id?: string;
    status?: CampaignStatus;
  },
): Campaign {
  const now = new Date().toISOString();
  const advertiser = advertisers.find((item) => item.id === data.advertiserId);
  const adSpace = adSpaces.find((item) => item.id === data.adSpaceId);

  return {
    id: options?.id ?? `camp-${Date.now()}`,
    tenantId: advertiser?.tenantId ?? adSpaces[0]?.tenantId ?? "tenant-shoppr",
    advertiserId: data.advertiserId,
    advertiserName: advertiser?.name ?? "Anunciante Demo",
    advertiserLogoUrl: advertiser?.logoUrl,
    adSpaceId: data.adSpaceId,
    adSpaceName: adSpace?.name ?? "Espacio Demo",
    name: data.name || "Campaña Demo",
    targetKeywords: data.keywords,
    targetIntents: data.intents,
    targetChannels: data.channels,
    schedule: {
      startDate: data.startDate,
      endDate: data.endDate,
    },
    dailyBudgetCents: data.dailyBudgetCents,
    totalBudgetCents: data.totalBudgetCents,
    spentCents: 0,
    costPerImpressionCents: data.costPerImpressionCents,
    priority: data.priority,
    messageTemplate: data.messageTemplate,
    ctaUrl: data.ctaUrl || undefined,
    creativeData: {
      buttonText: data.buttonText || undefined,
    },
    status: options?.status ?? "draft",
    totalImpressions: 0,
    totalClicks: 0,
    ctr: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function createAdvertiserFromForm(
  form: AdvertiserFormValues,
): Advertiser {
  const now = new Date().toISOString();
  const monthlyBudgetCents = Math.max(
    0,
    Math.round(Number(form.monthlyBudgetDollars || "0") * 100),
  );

  return {
    id: `adv-${Date.now()}`,
    tenantId: seedAdvertisers[0]?.tenantId ?? "tenant-shoppr",
    name: form.name.trim(),
    slug: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    contact: {
      name: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
    },
    billingInfo: {
      companyName: form.companyName.trim() || undefined,
      taxId: form.taxId.trim() || undefined,
    },
    monthlyBudgetCents,
    contractStart: form.contractStart || undefined,
    contractEnd: form.contractEnd || undefined,
    status: "active",
    activeCampaigns: 0,
    totalImpressions: 0,
    totalClicks: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function buildCsvContent<T extends Record<string, unknown>>(
  rows: T[],
): string {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        const serialized =
          value === null || value === undefined ? "" : String(value);
        return `"${serialized.replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  return [headers.join(","), ...body].join("\n");
}

export function normalizePersistedState(
  value: Partial<DemoPersistedState> | null | undefined,
): DemoPersistedState {
  if (!value) {
    return structuredClone(emptyDemoPersistedState);
  }

  return {
    notifications: Array.isArray(value.notifications)
      ? value.notifications
      : structuredClone(defaultDemoNotifications),
    recentSearches: Array.isArray(value.recentSearches)
      ? value.recentSearches
      : [],
    createdCampaigns: Array.isArray(value.createdCampaigns)
      ? value.createdCampaigns
      : [],
    campaignOverrides: value.campaignOverrides ?? {},
    createdAdvertisers: Array.isArray(value.createdAdvertisers)
      ? value.createdAdvertisers
      : [],
    advertiserOverrides: value.advertiserOverrides ?? {},
    adSpaceOverrides: value.adSpaceOverrides ?? {},
    settings: {
      ...defaultDemoSettings,
      ...(value.settings ?? {}),
      notifications: {
        ...defaultDemoSettings.notifications,
        ...(value.settings?.notifications ?? {}),
      },
    },
  };
}
