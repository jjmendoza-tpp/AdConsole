import type { AdConsoleRequestContext } from "./config";
import { AdConsoleDataError } from "./errors";
import type { AdConsoleRepository } from "./repository";

function assertFlamerlyContext(context: AdConsoleRequestContext): never {
  if (!context.tenantId) {
    throw new AdConsoleDataError(
      "tenant_missing",
      "Flamerly tenant context is required before the Ad Console plugin can query upstream data.",
    );
  }

  if (!context.accessToken) {
    throw new AdConsoleDataError(
      "unauthorized",
      "Flamerly access token is required before the Ad Console plugin can query upstream data.",
    );
  }

  throw new AdConsoleDataError(
    "upstream_error",
    "Flamerly repository is not implemented yet. Keep ADCONSOLE_DATA_SOURCE=mock until the upstream adapter is completed.",
  );
}

export function createFlamerlyAdConsoleRepository(
  context: AdConsoleRequestContext,
): AdConsoleRepository {
  return {
    async getDashboardSummary() {
      return assertFlamerlyContext(context);
    },
    async listCampaigns() {
      return assertFlamerlyContext(context);
    },
    async getCampaignById() {
      return assertFlamerlyContext(context);
    },
    async listAdvertisers() {
      return assertFlamerlyContext(context);
    },
    async getAdvertiserById() {
      return assertFlamerlyContext(context);
    },
    async listAdSpaces() {
      return assertFlamerlyContext(context);
    },
    async listKeywords() {
      return assertFlamerlyContext(context);
    },
  };
}
