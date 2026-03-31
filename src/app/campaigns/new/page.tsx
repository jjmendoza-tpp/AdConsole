import { WizardShell } from "@/components/campaigns/wizard-shell";
import { IntegrationState } from "@/components/shared/integration-state";
import { createAdConsoleRequestContext } from "@/lib/adconsole/config";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";

type NewCampaignPageState =
  | {
      kind: "ready";
      advertisers: Awaited<ReturnType<ReturnType<typeof getAdConsoleRepository>["listAdvertisers"]>>;
      adSpaces: Awaited<ReturnType<ReturnType<typeof getAdConsoleRepository>["listAdSpaces"]>>;
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadNewCampaignPageState(): Promise<NewCampaignPageState> {
  try {
    const repository = getAdConsoleRepository(createAdConsoleRequestContext());
    const [advertisers, adSpaces] = await Promise.all([
      repository.listAdvertisers(),
      repository.listAdSpaces(),
    ]);

    if (advertisers.length === 0 || adSpaces.length === 0) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", advertisers, adSpaces };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function NewCampaignPage() {
  const state = await loadNewCampaignPageState();

  if (state.kind === "state") {
    return state.variant === "empty" ? (
      <IntegrationState
        variant="empty"
        actionHref="/campaigns"
        actionLabel="Volver a campañas"
      />
    ) : (
      <IntegrationState variant={state.variant} />
    );
  }

  const { advertisers, adSpaces } = state;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Nueva Campaña</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configura y lanza una nueva campaña publicitaria.
        </p>
      </div>
      <WizardShell advertisers={advertisers} adSpaces={adSpaces} />
    </div>
  );
}
