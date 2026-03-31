import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopCampaignsTable } from "@/components/dashboard/top-campaigns-table";
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown";
import { IntegrationState } from "@/components/shared/integration-state";
import { getAdConsoleErrorState } from "@/lib/adconsole/errors";
import {
  getAdConsoleRepository,
  type DashboardSummary,
} from "@/lib/adconsole/repository";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";

type DashboardPageState =
  | {
      kind: "ready";
      dashboardSummary: DashboardSummary;
    }
  | {
      kind: "state";
      variant: "empty" | "unauthorized" | "tenantMissing" | "upstreamError";
    };

async function loadDashboardPageState(): Promise<DashboardPageState> {
  try {
    const repository = getAdConsoleRepository(
      await getServerAdConsoleRequestContext(),
    );
    const dashboardSummary = await repository.getDashboardSummary();

    if (
      dashboardSummary.kpis.length === 0 &&
      dashboardSummary.revenue.length === 0 &&
      dashboardSummary.topCampaigns.length === 0
    ) {
      return { kind: "state", variant: "empty" };
    }

    return { kind: "ready", dashboardSummary };
  } catch (error) {
    const errorState = getAdConsoleErrorState(error);

    if (errorState) {
      return { kind: "state", variant: errorState };
    }

    throw error;
  }
}

export default async function DashboardPage() {
  const state = await loadDashboardPageState();

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

  const { dashboardSummary } = state;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen de rendimiento de tus campanas publicitarias.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardSummary.kpis.map((kpi, i) => (
          <div key={kpi.label} className={`animate-in-view stagger-${i + 1}`}>
            <KPICard kpi={kpi} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={dashboardSummary.revenue} />
        </div>
        <div className="lg:col-span-1">
          <ChannelBreakdown data={dashboardSummary.channelBreakdown} />
        </div>
      </div>

      <TopCampaignsTable campaigns={dashboardSummary.topCampaigns} />
    </div>
  );
}
