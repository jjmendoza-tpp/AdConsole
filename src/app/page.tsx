import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopCampaignsTable } from "@/components/dashboard/top-campaigns-table";
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown";
import { dashboardKPIs } from "@/lib/mock-data";

export default function DashboardPage() {
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
        {dashboardKPIs.map((kpi, i) => (
          <div key={kpi.label} className={`animate-in-view stagger-${i + 1}`}>
            <KPICard kpi={kpi} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ChannelBreakdown />
        </div>
      </div>

      <TopCampaignsTable />
    </div>
  );
}
