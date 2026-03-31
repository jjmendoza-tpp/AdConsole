import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdvertiserDetail } from "@/components/advertisers/advertiser-detail";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";

type AdvertiserDetailPageState =
  | {
      kind: "ready";
      advertiser: NonNullable<
        Awaited<ReturnType<ReturnType<typeof getAdConsoleRepository>["getAdvertiserById"]>>
      >;
      campaigns: Awaited<ReturnType<ReturnType<typeof getAdConsoleRepository>["listCampaigns"]>>;
    }
  | {
      kind: "notFound";
    }
  | {
      kind: "state";
      variant: "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadAdvertiserDetailPageState(
  id: string,
): Promise<AdvertiserDetailPageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const [advertiser, campaigns] = await Promise.all([
      repository.getAdvertiserById(id),
      repository.listCampaigns(),
    ]);

    if (!advertiser) {
      return { kind: "notFound" };
    }

    return { kind: "ready", advertiser, campaigns };
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

  if (state.kind === "notFound") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <h2 className="text-xl font-semibold">Anunciante no encontrado</h2>
        <Button render={<Link href="/advertisers" />} variant="outline">
          Volver a anunciantes
        </Button>
      </div>
    );
  }

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
      advertiser={state.advertiser}
      campaigns={state.campaigns}
    />
  );
}
