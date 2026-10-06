const supportedDataSources = ["mock", "flamerly"] as const;
const supportedViewModes = ["admin", "user"] as const;

export type AdConsoleDataSource = (typeof supportedDataSources)[number];
export type AdConsoleViewMode = (typeof supportedViewModes)[number];

export interface AdConsoleConfig {
  dataSource: AdConsoleDataSource;
  flamerlyApiBasePath: string;
  defaultViewMode: AdConsoleViewMode;
}

export interface AdConsoleRequestContext {
  mode: AdConsoleDataSource;
  viewMode: AdConsoleViewMode;
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

export function normalizeAdConsoleViewMode(
  value: string | null | undefined,
): AdConsoleViewMode | null {
  if (value && supportedViewModes.includes(value as AdConsoleViewMode)) {
    return value as AdConsoleViewMode;
  }

  return null;
}

function resolveDefaultViewMode(value: string | undefined): AdConsoleViewMode {
  return normalizeAdConsoleViewMode(value) ?? "admin";
}

export const adConsoleConfig: AdConsoleConfig = {
  dataSource: resolveDataSource(process.env.ADCONSOLE_DATA_SOURCE),
  flamerlyApiBasePath:
    sanitizeOptionalEnv(process.env.ADCONSOLE_FLAMERLY_API_BASE_PATH) ??
    "/api/ads/v1",
  defaultViewMode: resolveDefaultViewMode(process.env.ADCONSOLE_DEFAULT_VIEW),
};

export function createAdConsoleRequestContext(
  overrides: Partial<AdConsoleRequestContext> = {},
): AdConsoleRequestContext {
  return {
    mode: adConsoleConfig.dataSource,
    viewMode: adConsoleConfig.defaultViewMode,
    tenantId: null,
    accessToken: null,
    apiBasePath: adConsoleConfig.flamerlyApiBasePath,
    ...overrides,
  };
}
