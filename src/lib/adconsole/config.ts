const supportedDataSources = ["mock", "flamerly"] as const;

export type AdConsoleDataSource = (typeof supportedDataSources)[number];

export interface AdConsoleConfig {
  dataSource: AdConsoleDataSource;
  flamerlyApiBasePath: string;
  defaultTenantId: string | null;
  defaultAccessToken: string | null;
}

export interface AdConsoleRequestContext {
  mode: AdConsoleDataSource;
  tenantId: string | null;
  accessToken: string | null;
  apiBasePath: string;
}

function sanitizeOptionalEnv(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function resolveDataSource(value: string | undefined): AdConsoleDataSource {
  if (value && supportedDataSources.includes(value as AdConsoleDataSource)) {
    return value as AdConsoleDataSource;
  }

  return "mock";
}

export const adConsoleConfig: AdConsoleConfig = {
  dataSource: resolveDataSource(process.env.ADCONSOLE_DATA_SOURCE),
  flamerlyApiBasePath:
    sanitizeOptionalEnv(process.env.ADCONSOLE_FLAMERLY_API_BASE_PATH) ??
    "/api/ads/v1",
  defaultTenantId: sanitizeOptionalEnv(process.env.ADCONSOLE_TENANT_ID),
  defaultAccessToken: sanitizeOptionalEnv(process.env.ADCONSOLE_ACCESS_TOKEN),
};

export function createAdConsoleRequestContext(
  overrides: Partial<AdConsoleRequestContext> = {},
): AdConsoleRequestContext {
  return {
    mode: adConsoleConfig.dataSource,
    tenantId: adConsoleConfig.defaultTenantId,
    accessToken: adConsoleConfig.defaultAccessToken,
    apiBasePath: adConsoleConfig.flamerlyApiBasePath,
    ...overrides,
  };
}
