// ============================================================
// Ad Console — Tipos del modelo de datos
// Basado en: Ad_Console_Especificacion_Tecnica.md
// ============================================================

// --- Anunciantes ---
export interface Advertiser {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  billingInfo?: {
    companyName?: string;
    taxId?: string;
    address?: string;
  };
  monthlyBudgetCents: number;
  contractStart?: string;
  contractEnd?: string;
  status: "active" | "inactive" | "suspended";
  activeCampaigns: number;
  totalImpressions: number;
  totalClicks: number;
  createdAt: string;
  updatedAt: string;
}

// --- Espacios Publicitarios ---
export type AdSpaceType =
  | "product_recommendation"
  | "sponsored_tip"
  | "brand_mention";

export interface AdSpace {
  id: string;
  tenantId: string;
  name: string;
  spaceType: AdSpaceType;
  channelFilter: Channel[];
  assistantFilter: string[];
  maxAdsPerConversation: number;
  cooldownMinutes: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// --- Campañas ---
export type CampaignStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type Channel = "whatsapp" | "web" | "voice" | "telegram";

export type Intent =
  | "product_search"
  | "price_comparison"
  | "brand_inquiry"
  | "general_info";

export interface CampaignSchedule {
  startDate: string;
  endDate: string;
  daysOfWeek?: number[];
  hoursOfDay?: {
    start: number;
    end: number;
  };
}

export interface CampaignCreative {
  imageUrl?: string;
  buttonText?: string;
  description?: string;
}

export interface Campaign {
  id: string;
  tenantId: string;
  advertiserId: string;
  advertiserName: string;
  advertiserLogoUrl?: string;
  adSpaceId: string;
  adSpaceName: string;
  name: string;
  targetKeywords: string[];
  targetIntents: Intent[];
  targetChannels: Channel[];
  schedule: CampaignSchedule;
  dailyBudgetCents: number;
  totalBudgetCents: number;
  spentCents: number;
  costPerImpressionCents: number;
  priority: number;
  messageTemplate: string;
  ctaUrl?: string;
  creativeData?: CampaignCreative;
  status: CampaignStatus;
  totalImpressions: number;
  totalClicks: number;
  ctr: number;
  createdAt: string;
  updatedAt: string;
}

// --- Impresiones ---
export interface Impression {
  id: string;
  campaignId: string;
  advertiserId: string;
  conversationId: string;
  channel: Channel;
  assistantId: string;
  keywordsMatched: string[];
  costCents: number;
  servedAt: string;
}

// --- Clicks ---
export interface Click {
  id: string;
  impressionId: string;
  campaignId: string;
  ctaUrl: string;
  clickedAt: string;
}

// --- Dashboard KPIs ---
export interface DashboardKPI {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage";
  trend: "up" | "down" | "neutral";
  changePercent: number;
  subtitle?: string;
}

// --- Analytics ---
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  impressions: number;
  clicks: number;
}

export interface ChannelBreakdown {
  channel: Channel;
  label: string;
  impressions: number;
  percentage: number;
  color: string;
}

// --- Keywords ---
export interface Keyword {
  id: string;
  keyword: string;
  volume: number;
  activeCampaigns: number;
  avgCpm: number;
  trend: "up" | "down" | "stable";
}

// --- Navegación ---
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  isNew?: boolean;
}
