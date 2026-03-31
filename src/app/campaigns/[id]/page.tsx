import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CampaignDetail } from "@/components/campaigns/campaign-detail";
import { IntegrationState } from "@/components/shared/integration-state";
import { createAdConsoleRequestContext } from "@/lib/adconsole/config";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";

type CampaignDetailPageState =
  | {
      kind: "ready";
      campaign: NonNullable<
        Awaited<ReturnType<ReturnType<typeof getAdConsoleRepository>["getCampaignById"]>>
      >;
    }
  | {
      kind: "notFound";
    }
  | {
      kind: "state";
      variant: "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadCampaignDetailPageState(
  id: string,
): Promise<CampaignDetailPageState> {
  try {
    const repository = getAdConsoleRepository(createAdConsoleRequestContext());
    const campaign = await repository.getCampaignById(id);

    if (!campaign) {
      return { kind: "notFound" };
    }

    return { kind: "ready", campaign };
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

  if (state.kind === "notFound") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-xl font-semibold">Campaña no encontrada</h2>
        <Button render={<Link href="/campaigns" />} variant="outline">
          Volver a campañas
        </Button>
      </div>
    );
  }

  if (state.kind === "state") {
    return (
      <IntegrationState
        variant={state.variant}
        actionHref="/campaigns"
        actionLabel="Volver a campañas"
      />
    );
  }

  return <CampaignDetail campaign={state.campaign} />;
}
