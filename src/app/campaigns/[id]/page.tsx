import { CampaignDetail } from "@/components/campaigns/campaign-detail";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";
import type { Campaign } from "@/lib/types";

type CampaignDetailPageState =
  | {
      kind: "ready";
      campaigns: Campaign[];
    }
  | {
      kind: "state";
      variant: "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadCampaignDetailPageState(
  id: string,
): Promise<CampaignDetailPageState> {
  void id;

  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const campaigns = await repository.listCampaigns();

    return { kind: "ready", campaigns };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const state = await loadCampaignDetailPageState(id);

  if (state.kind === "state") {
    return (
      <IntegrationState
        variant={state.variant}
        actionHref="/campaigns"
        actionLabel="Volver a campañas"
      />
    );
  }

  return <CampaignDetail campaignId={id} initialCampaigns={state.campaigns} />;
}
