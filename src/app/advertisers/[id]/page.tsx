import { AdvertiserDetail } from "@/components/advertisers/advertiser-detail";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";

type AdvertiserDetailPageState =
  | {
      kind: "ready";
      advertisers: Awaited<ReturnType<ReturnType<ReturnType<typeof getAdConsoleRepository>["listAdvertisers"]>>>;
      campaigns: Awaited<ReturnType<ReturnType<typeof getAdConsoleRepository>["listCampaigns"]>>;
    }
  | {
      kind: "state";
      variant: "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadAdvertiserDetailPageState(
  id: string,
): Promise<AdvertiserDetailPageState> {
  void id;

  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const [advertisers, campaigns] = await Promise.all([
      repository.listAdvertisers(),
      repository.listCampaigns(),
    ]);

    return { kind: "ready", advertisers, campaigns };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function AdvertiserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const state = await loadAdvertiserDetailPageState(id);

  if (state.kind === "state") {
    return (
      <IntegrationState
        variant={state.variant}
        actionHref="/advertisers"
        actionLabel="Volver a anunciantes"
      />
    );
  }

  return (
    <AdvertiserDetail
      advertiserId={id}
      initialAdvertisers={state.advertisers}
      initialCampaigns={state.campaigns}
    />
  );
}
