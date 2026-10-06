import { IntegrationState } from "@/components/shared/integration-state";
import { AdvertisersPageClient } from "@/components/advertisers/advertisers-page-client";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";
import type { Advertiser } from "@/lib/types";

type AdvertisersPageState =
  | {
      kind: "ready";
      advertisers: Advertiser[];
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadAdvertisersPageState(): Promise<AdvertisersPageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const advertisers = await repository.listAdvertisers();

    if (advertisers.length === 0) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", advertisers };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function AdvertisersPage() {
  const state = await loadAdvertisersPageState();

  if (state.kind === "state") {
    return state.variant === "empty" ? (
      <IntegrationState
        variant="empty"
        actionHref="/advertisers/new"
        actionLabel="Nuevo Anunciante"
      />
    ) : (
      <IntegrationState variant={state.variant} />
    );
  }

  const { advertisers } = state;

  return <AdvertisersPageClient initialAdvertisers={advertisers} />;
}
