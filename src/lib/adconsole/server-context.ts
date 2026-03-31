import "server-only";

import { cookies, headers } from "next/headers";
import { createAdConsoleRequestContext } from "./config";

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

export async function getServerAdConsoleRequestContext() {
  const requestHeaders = await headers();
  const cookieStore = await cookies();

  const tenantId = firstNonEmpty(
    requestHeaders.get("x-flamerly-tenant-id"),
    requestHeaders.get("x-tenant-id"),
    cookieStore.get("flamerly_tenant_id")?.value,
    cookieStore.get("adconsole_tenant_id")?.value,
  );

  const bearerToken = requestHeaders
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  const accessToken = firstNonEmpty(
    bearerToken,
    requestHeaders.get("x-flamerly-access-token"),
    requestHeaders.get("x-adconsole-access-token"),
    cookieStore.get("flamerly_access_token")?.value,
    cookieStore.get("adconsole_access_token")?.value,
  );

  return createAdConsoleRequestContext({
    tenantId,
    accessToken,
  });
}
