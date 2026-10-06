import { IntegrationState } from "@/components/shared/integration-state";
import { CampaignsPageClient } from "@/components/campaigns/campaigns-page-client";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";
import type { Campaign } from "@/lib/types";

type CampaignsPageState =
  | {
      kind: "ready";
      campaigns: Campaign[];
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadCampaignsPageState(): Promise<CampaignsPageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const campaigns = await repository.listCampaigns();

    if (campaigns.length === 0) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", campaigns };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function CampaignsPage() {
  const state = await loadCampaignsPageState();

  if (state.kind === "state") {
    return state.variant === "empty" ? (
      <IntegrationState
        variant="empty"
        actionHref="/campaigns/new"
        actionLabel="Crear campaña"
      />
    ) : (
      <IntegrationState variant={state.variant} />
    );
  }

  const { campaigns } = state;

  return <CampaignsPageClient initialCampaigns={campaigns} />;
}
