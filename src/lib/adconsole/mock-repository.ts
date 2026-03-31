import type { Advertiser, Campaign } from "@/lib/types";
import { adSpaces } from "../mock-data/ad-spaces";
import { advertisers } from "../mock-data/advertisers";
import { campaigns } from "../mock-data/campaigns";
import { channelBreakdown, dashboardKPIs, revenueData } from "../mock-data/dashboard";
import { keywords } from "../mock-data/keywords";
import type { AdConsoleRequestContext } from "./config";
import type {
  AdConsoleRepository,
  DashboardSummary,
  DashboardTopCampaign,
} from "./repository";

const dashboardTopCampaigns: DashboardTopCampaign[] = [
  {
    id: "stitch-1",
    name: "Promo Medalla Light",
    advertiserName: "Medalla Light",
    totalImpressions: 4200,
    ctr: 5.1,
    status: "active",
  },
  {
    id: "stitch-2",
    name: "Sabor de Goya",
    advertiserName: "Goya Foods PR",
    totalImpressions: 3800,
    ctr: 4.8,
    status: "active",
  },
  {
    id: "stitch-3",
    name: "Pan Pepin Fresco",
    advertiserName: "Pan Pepin",
    totalImpressions: 3100,
    ctr: 4.2,
    status: "active",
  },
  {
    id: "stitch-4",
    name: "Walmart Ofertas Semanales",
    advertiserName: "Walmart PR",
    totalImpressions: 2900,
    ctr: 3.9,
    status: "active",
  },
  {
    id: "stitch-5",
    name: "Plaza Aniversario",
    advertiserName: "Plaza Las Americas",
    totalImpressions: 2500,
    ctr: 4.5,
    status: "active",
  },
];

function clone<T>(value: T): T {
  return structuredClone(value);
}

function cloneCollection<T>(value: T[]): T[] {
  return value.map((item) => clone(item));
}

function cloneDashboardSummary(summary: DashboardSummary): DashboardSummary {
  return {
    kpis: cloneCollection(summary.kpis),
    revenue: cloneCollection(summary.revenue),
    channelBreakdown: cloneCollection(summary.channelBreakdown),
    topCampaigns: cloneCollection(summary.topCampaigns),
  };
}

const dashboardSummary: DashboardSummary = {
  kpis: dashboardKPIs,
  revenue: revenueData,
  channelBreakdown,
  topCampaigns: dashboardTopCampaigns,
};

function findById<T extends { id: string }>(items: T[], id: string): T | null {
  return items.find((item) => item.id === id) ?? null;
}

export function createMockAdConsoleRepository(
  context: AdConsoleRequestContext,
): AdConsoleRepository {
  void context;

  return {
    async getDashboardSummary() {
      return cloneDashboardSummary(dashboardSummary);
    },
    async listCampaigns() {
      return cloneCollection(campaigns);
    },
    async getCampaignById(id: string) {
      const campaign = findById<Campaign>(campaigns, id);
      return campaign ? clone(campaign) : null;
    },
    async listAdvertisers() {
      return cloneCollection(advertisers);
    },
    async getAdvertiserById(id: string) {
      const advertiser = findById<Advertiser>(advertisers, id);
      return advertiser ? clone(advertiser) : null;
    },
    async listAdSpaces() {
      return cloneCollection(adSpaces);
    },
    async listKeywords() {
      return cloneCollection(keywords);
    },
  };
}
