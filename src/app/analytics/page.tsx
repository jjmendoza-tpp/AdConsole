import { AnalyticsPage } from "@/components/analytics/analytics-page";
import { createAdConsoleRequestContext } from "@/lib/adconsole/config";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";

export default async function AnalyticsRoutePage() {
  const repository = getAdConsoleRepository(createAdConsoleRequestContext());
  const [dashboardSummary, campaigns] = await Promise.all([
    repository.getDashboardSummary(),
    repository.listCampaigns(),
  ]);

  return (
    <AnalyticsPage
      campaigns={campaigns}
      channelBreakdown={dashboardSummary.channelBreakdown}
      revenueData={dashboardSummary.revenue}
    />
  );
}
