import type { AdConsoleRequestContext } from "./config";
import type { AdConsoleRepository } from "./repository";

function notImplemented(): never {
  throw new Error(
    "Flamerly repository is not implemented yet. Keep ADCONSOLE_DATA_SOURCE=mock until the upstream adapter is completed.",
  );
}

export function createFlamerlyAdConsoleRepository(
  context: AdConsoleRequestContext,
): AdConsoleRepository {
  void context;

  return {
    async getDashboardSummary() {
      return notImplemented();
    },
    async listCampaigns() {
      return notImplemented();
    },
    async getCampaignById() {
      return notImplemented();
    },
    async listAdvertisers() {
      return notImplemented();
    },
    async getAdvertiserById() {
      return notImplemented();
    },
    async listAdSpaces() {
      return notImplemented();
    },
    async listKeywords() {
      return notImplemented();
    },
  };
}
