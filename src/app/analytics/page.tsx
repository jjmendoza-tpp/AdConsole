import { AnalyticsPage } from "@/components/analytics/analytics-page";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import {
  getAdConsoleRepository,
  type DashboardSummary,
} from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";
import type { Campaign } from "@/lib/types";

type AnalyticsRoutePageState =
  | {
      kind: "ready";
      dashboardSummary: DashboardSummary;
      campaigns: Campaign[];
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadAnalyticsRoutePageState(): Promise<AnalyticsRoutePageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const [dashboardSummary, campaigns] = await Promise.all([
      repository.getDashboardSummary(),
      repository.listCampaigns(),
    ]);

    if (campaigns.length === 0 && dashboardSummary.revenue.length === 0) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", dashboardSummary, campaigns };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function AnalyticsRoutePage() {
  const state = await loadAnalyticsRoutePageState();

  if (state.kind === "state") {
    return state.variant === "empty" ? (
      <IntegrationState
        variant="empty"
        actionHref="/campaigns"
        actionLabel="Ir a campañas"
      />
    ) : (
      <IntegrationState variant={state.variant} />
    );
  }

  return (
    <AnalyticsPage
      campaigns={state.campaigns}
      channelBreakdown={state.dashboardSummary.channelBreakdown}
      revenueData={state.dashboardSummary.revenue}
    />
  );
}
