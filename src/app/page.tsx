import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopCampaignsTable } from "@/components/dashboard/top-campaigns-table";
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown";
import { dashboardKPIs } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Database, Award } from "lucide-react";

const quickAccessItems = [
  { title: "Reportes", subtitle: "Mensual de Agosto", icon: FileText },
  { title: "Soporte", subtitle: "Chat en vivo", icon: Users },
  { title: "API", subtitle: "Docs & SDK", icon: Database },
  { title: "Plan", subtitle: "Enterprise", icon: Award },
];

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

      {/* CTA Banner + Quick Access Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* CTA Banner — 2/3 width */}
        <div className="lg:col-span-2">
          <div className="bg-[#3366CC] text-white rounded-xl p-8 flex flex-col justify-center h-full">
            <h2 className="text-xl font-bold mb-2">Potencia tus Campanas</h2>
            <p className="text-sm text-white/80 mb-6 max-w-lg">
              Utiliza nuestra nueva IA para optimizar Keywords en tiempo real y
              mejorar el CTR hasta en un 22%.
            </p>
            <div>
              <button className="bg-white/20 hover:bg-white/30 transition-colors text-white font-medium text-sm px-5 py-2.5 rounded-lg">
                Probar Ahora
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Grid — 1/3 width */}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-4 h-full">
            {quickAccessItems.map((item) => (
              <Card
                key={item.title}
                className="card-hover cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <CardContent className="pt-5 pb-5 flex flex-col items-center gap-2">
                  <item.icon className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    {item.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
