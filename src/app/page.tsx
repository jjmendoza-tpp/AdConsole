import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopCampaignsTable } from "@/components/dashboard/top-campaigns-table";
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown";
import { dashboardKPIs } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen de rendimiento de tus campanas publicitarias.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardKPIs.map((kpi, i) => (
          <div key={kpi.label} className={`animate-in-view stagger-${i + 1}`}>
            <KPICard kpi={kpi} />
          </div>
        ))}
      </div>

      {/* Revenue Chart + Channel Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ChannelBreakdown />
        </div>
      </div>

      {/* Top Campaigns */}
      <TopCampaignsTable />
    </div>
  );
}
