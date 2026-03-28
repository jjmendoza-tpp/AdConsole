import { WizardShell } from "@/components/campaigns/wizard-shell";

export default function NewCampaignPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Nueva Campaña</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configura y lanza una nueva campaña publicitaria.
        </p>
      </div>
      <WizardShell />
    </div>
  );
}
