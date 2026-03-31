import { AdSpacesPage } from "@/components/ad-spaces/ad-spaces-page";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";
import type { AdSpace } from "@/lib/types";

type AdSpacesRoutePageState =
  | {
      kind: "ready";
      adSpaces: AdSpace[];
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadAdSpacesRoutePageState(): Promise<AdSpacesRoutePageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const adSpaces = await repository.listAdSpaces();

    if (adSpaces.length === 0) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", adSpaces };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function AdSpacesRoutePage() {
  const state = await loadAdSpacesRoutePageState();

  if (state.kind === "state") {
    return state.variant === "empty" ? (
      <IntegrationState variant="empty" />
    ) : (
      <IntegrationState variant={state.variant} />
    );
  }

  return <AdSpacesPage adSpaces={state.adSpaces} />;
}
