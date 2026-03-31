import { AdSpacesPage } from "@/components/ad-spaces/ad-spaces-page";
import { createAdConsoleRequestContext } from "@/lib/adconsole/config";
import { getAdConsoleRepository } from "@/lib/adconsole/repository";

export default async function AdSpacesRoutePage() {
  const repository = getAdConsoleRepository(createAdConsoleRequestContext());
  const adSpaces = await repository.listAdSpaces();

  return <AdSpacesPage adSpaces={adSpaces} />;
}
