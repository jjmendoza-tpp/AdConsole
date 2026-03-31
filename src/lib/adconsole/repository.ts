import type {
  AdSpace,
  Advertiser,
  Campaign,
  ChannelBreakdown,
  DashboardKPI,
  Keyword,
  RevenueDataPoint,
} from "@/lib/types";
import type { AdConsoleRequestContext } from "./config";
import { createFlamerlyAdConsoleRepository } from "./flamerly-repository";
import { createMockAdConsoleRepository } from "./mock-repository";

export interface DashboardTopCampaign {
  id: string;
  name: string;
  advertiserName: string;
  totalImpressions: number;
  ctr: number;
  status: Campaign["status"];
}

export interface DashboardSummary {
  kpis: DashboardKPI[];
  revenue: RevenueDataPoint[];
  channelBreakdown: ChannelBreakdown[];
  topCampaigns: DashboardTopCampaign[];
}

export interface AdConsoleRepository {
  getDashboardSummary(): Promise<DashboardSummary>;
  listCampaigns(): Promise<Campaign[]>;
  getCampaignById(id: string): Promise<Campaign | null>;
  listAdvertisers(): Promise<Advertiser[]>;
  getAdvertiserById(id: string): Promise<Advertiser | null>;
  listAdSpaces(): Promise<AdSpace[]>;
  listKeywords(): Promise<Keyword[]>;
}

export function getAdConsoleRepository(
  context: AdConsoleRequestContext,
): AdConsoleRepository {
  switch (context.mode) {
    case "mock":
      return createMockAdConsoleRepository(context);
    case "flamerly":
      return createFlamerlyAdConsoleRepository(context);
    default:
      throw new Error(`Unsupported Ad Console data source: ${context.mode satisfies never}`);
  }
}
