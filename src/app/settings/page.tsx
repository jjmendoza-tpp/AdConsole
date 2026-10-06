import { redirect } from "next/navigation";
import { SettingsPageClient } from "@/components/settings/settings-page";
import { buildViewHref } from "@/lib/adconsole/demo-runtime";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const context = await getServerAdConsoleRequestContext({
    requestedViewMode: resolvedSearchParams.view,
  });

  if (context.viewMode === "user") {
    redirect(buildViewHref("/", "user"));
  }

  return <SettingsPageClient />;
}
