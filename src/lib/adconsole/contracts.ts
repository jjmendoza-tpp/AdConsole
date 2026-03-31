import type { AdSpace, Advertiser, Campaign, Keyword } from "@/lib/types";
import type { DashboardSummary } from "./repository";

export const adConsoleContractPaths = {
  dashboard: "/api/ads/v1/dashboard",
  campaigns: "/api/ads/v1/campaigns",
  campaignById: (id: string) => `/api/ads/v1/campaigns/${id}`,
  advertisers: "/api/ads/v1/advertisers",
  advertiserById: (id: string) => `/api/ads/v1/advertisers/${id}`,
  adSpaces: "/api/ads/v1/ad-spaces",
  keywords: "/api/ads/v1/keywords",
} as const;

export interface FlamerlyAdConsoleMeta {
  tenantId: string;
  requestId?: string;
  generatedAt: string;
}

export interface FlamerlyEntityResponse<T> {
  data: T;
  meta: FlamerlyAdConsoleMeta;
}

export interface FlamerlyCollectionResponse<T> {
  data: T[];
  meta: FlamerlyAdConsoleMeta;
}

export type DashboardContractResponse = FlamerlyEntityResponse<DashboardSummary>;
export type CampaignsContractResponse = FlamerlyCollectionResponse<Campaign>;
export type CampaignByIdContractResponse = FlamerlyEntityResponse<Campaign>;
export type AdvertisersContractResponse = FlamerlyCollectionResponse<Advertiser>;
export type AdvertiserByIdContractResponse = FlamerlyEntityResponse<Advertiser>;
export type AdSpacesContractResponse = FlamerlyCollectionResponse<AdSpace>;
export type KeywordsContractResponse = FlamerlyCollectionResponse<Keyword>;

export type FlamerlyAdConsoleErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "tenant_missing"
  | "upstream_unavailable"
  | "validation_error";

export interface FlamerlyAdConsoleError {
  status: 401 | 403 | 404 | 422 | 503;
  code: FlamerlyAdConsoleErrorCode;
  message: string;
  retryable: boolean;
}
