"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  BookOpen,
  CircleHelp,
  Copy,
  Download,
  Megaphone,
  Search,
  Settings2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { AdConsoleDataSource, AdConsoleViewMode } from "@/lib/adconsole/config";
import {
  ADCONSOLE_DEMO_STATE_KEY,
  buildCsvContent,
  buildViewHref,
  cloneSeedAdSpaces,
  cloneSeedAdvertisers,
  cloneSeedCampaigns,
  cloneSeedChannelBreakdown,
  cloneSeedDashboardKpis,
  cloneSeedKeywords,
  cloneSeedRevenueData,
  createAdvertiserFromForm,
  createCampaignFromComposer,
  defaultDemoNotifications,
  defaultDemoSettings,
  demoRouteSearchEntries,
  emptyDemoPersistedState,
  formatCurrency,
  mergeAdSpaces,
  mergeAdvertisers,
  mergeCampaigns,
  normalizePersistedState,
  type AdvertiserFormValues,
  type CampaignComposerData,
  type DemoNotification,
  type DemoPersistedState,
  type DemoSearchResult,
  type DemoSettingsState,
} from "@/lib/adconsole/demo-runtime";
import {
  ADCONSOLE_VIEW_COOKIE,
  ADCONSOLE_VIEW_QUERY_PARAM,
} from "@/lib/adconsole/server-context";
import type {
  AdSpace,
  Advertiser,
  Campaign,
  CampaignStatus,
  ChannelBreakdown,
  DashboardKPI,
  Keyword,
  RevenueDataPoint,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface HelpLink {
  label: string;
  description: string;
  href: string;
}

interface HelpSection {
  title: string;
  description: string;
  links: HelpLink[];
}

interface FeedbackMessage {
  id: string;
  message: string;
}

interface AdConsoleAppContextValue {
  dataSource: AdConsoleDataSource;
  viewMode: AdConsoleViewMode;
  hydrated: boolean;
  campaigns: Campaign[];
  advertisers: Advertiser[];
  adSpaces: AdSpace[];
  keywords: Keyword[];
  revenueData: RevenueDataPoint[];
  channelBreakdown: ChannelBreakdown[];
  dashboardKpis: DashboardKPI[];
  settings: DemoSettingsState;
  notifications: DemoNotification[];
  unreadNotificationsCount: number;
  recentSearches: string[];
  searchOpen: boolean;
  notificationsOpen: boolean;
  helpOpen: boolean;
  helpSection: HelpSection;
  openSearch: () => void;
  closeSearch: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  openHelp: (topic?: string) => void;
  closeHelp: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  rememberSearch: (query: string) => void;
  findSearchResults: (query: string) => DemoSearchResult[];
  getViewHref: (href: string) => string;
  copyToClipboard: (value: string, label?: string) => Promise<boolean>;
  downloadCsv: (filename: string, rows: Array<Record<string, unknown>>) => void;
  saveSettings: (partial: Partial<DemoSettingsState>) => void;
  createAdvertiser: (form: AdvertiserFormValues) => Advertiser;
  updateAdvertiser: (id: string, partial: Partial<Advertiser>) => void;
  saveCampaignDraft: (data: CampaignComposerData, id?: string) => Campaign;
  launchCampaign: (data: CampaignComposerData, id?: string) => Campaign;
  updateCampaign: (id: string, partial: Partial<Campaign>) => void;
  setCampaignStatus: (id: string, status: CampaignStatus) => void;
  updateAdSpace: (id: string, partial: Partial<AdSpace>) => void;
  pushFeedback: (message: string) => void;
}

const AdConsoleAppContext = createContext<AdConsoleAppContextValue | null>(null);

const helpContentByPath: Record<string, HelpSection> = {
  "/": {
    title: "Ayuda del dashboard",
    description: "KPIs, revenue y campañas destacadas para tu revisión comercial.",
    links: [
      {
        label: "Ir a Analytics",
        description: "Profundiza en revenue, alertas y mix de inventario.",
        href: "/analytics",
      },
      {
        label: "Ver Campañas",
        description: "Abre la vista operativa para filtrar y exportar campañas.",
        href: "/campaigns",
      },
    ],
  },
  "/campaigns": {
    title: "Ayuda de campañas",
    description: "Gestiona estados, exportes, filtros y borradores de lanzamiento.",
    links: [
      {
        label: "Crear nueva campaña",
        description: "Abre el wizard con targeting, presupuesto y creativo.",
        href: "/campaigns/new",
      },
      {
        label: "Ver anunciantes",
        description: "Cruza campañas con contactos y budgets mensuales.",
        href: "/advertisers",
      },
    ],
  },
  "/advertisers": {
    title: "Ayuda de anunciantes",
    description: "Edita perfiles comerciales y lanza campañas desde cada cuenta.",
    links: [
      {
        label: "Nuevo anunciante",
        description: "Agrega un anunciante al prototipo con datos persistentes.",
        href: "/advertisers/new",
      },
      {
        label: "Ir a campañas",
        description: "Explora el impacto comercial por cuenta.",
        href: "/campaigns",
      },
    ],
  },
  "/analytics": {
    title: "Ayuda de analytics",
    description: "Exporta reportes, revisa alertas y cambia el rango temporal.",
    links: [
      {
        label: "Volver al dashboard",
        description: "Revisa el resumen ejecutivo de performance.",
        href: "/",
      },
      {
        label: "Ver campañas",
        description: "Baja del reporte a la operación de cada campaña.",
        href: "/campaigns",
      },
    ],
  },
  "/keywords": {
    title: "Ayuda de keywords",
    description: "Consulta volumen, CPM y campañas activas por intención.",
    links: [
      {
        label: "Ir a analytics",
        description: "Cruza insights de keywords con revenue y alertas.",
        href: "/analytics",
      },
    ],
  },
  "/ad-spaces": {
    title: "Ayuda de espacios",
    description: "Solo administradores: define slots, cooldowns y activación.",
    links: [
      {
        label: "Documentación operativa",
        description: "Revisa cómo usar slots y recomendaciones IA.",
        href: "/ad-spaces",
      },
      {
        label: "Ir a ajustes",
        description: "Completa webhook y notificaciones antes de producción.",
        href: "/settings",
      },
    ],
  },
  "/settings": {
    title: "Ayuda de ajustes",
    description: "Solo administradores: tenant, webhook, seguridad y alertas.",
    links: [
      {
        label: "Abrir dashboard",
        description: "Regresa al resumen ejecutivo del prototipo.",
        href: "/",
      },
      {
        label: "Ir a espacios",
        description: "Conecta la configuración con la gestión de inventario.",
        href: "/ad-spaces",
      },
    ],
  },
};

function readLocalStorageState(): DemoPersistedState {
  if (typeof window === "undefined") {
    return structuredClone(emptyDemoPersistedState);
  }

  try {
    const raw = window.localStorage.getItem(ADCONSOLE_DEMO_STATE_KEY);

    if (!raw) {
      return structuredClone(emptyDemoPersistedState);
    }

    return normalizePersistedState(JSON.parse(raw));
  } catch {
    return structuredClone(emptyDemoPersistedState);
  }
}

function getHelpSection(pathname: string, viewMode: AdConsoleViewMode): HelpSection {
  const section =
    helpContentByPath[pathname] ??
    helpContentByPath[`/${pathname.split("/").filter(Boolean)[0]}`] ??
    {
      title: "Centro de ayuda",
      description: "Atajos de navegación y guías rápidas del prototipo.",
      links: [
        {
          label: "Dashboard",
          description: "Resumen principal del negocio.",
          href: "/",
        },
        {
          label: "Campañas",
          description: "Operación central y exportes.",
          href: "/campaigns",
        },
      ],
    };

  return {
    ...section,
    links: section.links.filter((link) => {
      if (viewMode === "admin") {
        return true;
      }

      return link.href !== "/ad-spaces" && link.href !== "/settings";
    }),
  };
}

export function AdConsoleAppProvider({
  children,
  defaultViewMode,
  dataSource,
}: {
  children: ReactNode;
  defaultViewMode: AdConsoleViewMode;
  dataSource: AdConsoleDataSource;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedViewMode = searchParams.get(ADCONSOLE_VIEW_QUERY_PARAM);
  const [hydrated, setHydrated] = useState(false);
  const [persistedState, setPersistedState] = useState<DemoPersistedState>(
    structuredClone(emptyDemoPersistedState),
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState<string | undefined>();
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);

  useEffect(() => {
    const nextState = readLocalStorageState();
    setPersistedState(nextState);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      ADCONSOLE_DEMO_STATE_KEY,
      JSON.stringify(persistedState),
    );
  }, [hydrated, persistedState]);

  const viewMode = (requestedViewMode === "admin" || requestedViewMode === "user"
    ? requestedViewMode
    : defaultViewMode) as AdConsoleViewMode;

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.cookie = `${ADCONSOLE_VIEW_COOKIE}=${viewMode}; path=/; max-age=31536000; samesite=lax`;
  }, [viewMode]);

  const campaigns = useMemo(
    () => mergeCampaigns(cloneSeedCampaigns(), persistedState),
    [persistedState],
  );
  const advertisers = useMemo(
    () => mergeAdvertisers(cloneSeedAdvertisers(), persistedState, campaigns),
    [persistedState, campaigns],
  );
  const adSpaces = useMemo(
    () => mergeAdSpaces(cloneSeedAdSpaces(), persistedState),
    [persistedState],
  );
  const keywords = useMemo(() => cloneSeedKeywords(), []);
  const revenueData = useMemo(() => cloneSeedRevenueData(), []);
  const channelBreakdown = useMemo(() => cloneSeedChannelBreakdown(), []);
  const dashboardKpis = useMemo(() => cloneSeedDashboardKpis(), []);
  const notifications = persistedState.notifications;
  const settings = persistedState.settings;
  const unreadNotificationsCount = notifications.filter((item) => !item.read).length;
  const recentSearches = persistedState.recentSearches;

  const getViewHref = useCallback(
    (href: string) => buildViewHref(href, viewMode),
    [viewMode],
  );

  const pushFeedback = useCallback((message: string) => {
    const id = `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setFeedbackMessages((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setFeedbackMessages((current) => current.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  const copyToClipboard = useCallback(
    async (value: string, label = "Valor copiado") => {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        pushFeedback("Clipboard no disponible en este navegador.");
        return false;
      }

      try {
        await navigator.clipboard.writeText(value);
        pushFeedback(`${label}.`);
        return true;
      } catch {
        pushFeedback("No se pudo copiar el valor.");
        return false;
      }
    },
    [pushFeedback],
  );

  const downloadCsv = useCallback(
    (filename: string, rows: Array<Record<string, unknown>>) => {
      if (typeof document === "undefined") {
        return;
      }

      const content = buildCsvContent(rows);
      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      pushFeedback(`Exportando ${filename}.`);
    },
    [pushFeedback],
  );

  const rememberSearch = useCallback((query: string) => {
    const normalized = query.trim();

    if (!normalized) {
      return;
    }

    setPersistedState((current) => ({
      ...current,
      recentSearches: [normalized, ...current.recentSearches.filter((item) => item !== normalized)].slice(0, 6),
    }));
  }, []);

  const findSearchResults = useCallback(
    (query: string) => {
      const normalized = query.trim().toLowerCase();
      const routeResults = demoRouteSearchEntries
        .filter((entry) => {
          if (viewMode === "user" && (entry.path === "/ad-spaces" || entry.path === "/settings")) {
            return false;
          }

          if (!normalized) {
            return true;
          }

          return (
            entry.title.toLowerCase().includes(normalized) ||
            entry.subtitle.toLowerCase().includes(normalized)
          );
        })
        .map((entry) => ({
          id: entry.id,
          kind: entry.kind,
          title: entry.title,
          subtitle: entry.subtitle,
          href: getViewHref(entry.path),
        })) satisfies DemoSearchResult[];

      const campaignResults = campaigns
        .filter((campaign) => {
          if (!normalized) {
            return false;
          }

          return (
            campaign.name.toLowerCase().includes(normalized) ||
            campaign.advertiserName.toLowerCase().includes(normalized)
          );
        })
        .slice(0, 8)
        .map((campaign) => ({
          id: campaign.id,
          kind: "campaign" as const,
          title: campaign.name,
          subtitle: `${campaign.advertiserName} · ${formatCurrency(campaign.totalBudgetCents)}`,
          href: getViewHref(`/campaigns/${campaign.id}`),
        }));

      const advertiserResults = advertisers
        .filter((advertiser) => {
          if (!normalized) {
            return false;
          }

          return (
            advertiser.name.toLowerCase().includes(normalized) ||
            advertiser.contact.name.toLowerCase().includes(normalized)
          );
        })
        .slice(0, 8)
        .map((advertiser) => ({
          id: advertiser.id,
          kind: "advertiser" as const,
          title: advertiser.name,
          subtitle: advertiser.contact.name,
          href: getViewHref(`/advertisers/${advertiser.id}`),
        }));

      const keywordResults = keywords
        .filter((keyword) => {
          if (!normalized) {
            return false;
          }

          return keyword.keyword.toLowerCase().includes(normalized);
        })
        .slice(0, 8)
        .map((keyword) => ({
          id: keyword.id,
          kind: "keyword" as const,
          title: keyword.keyword,
          subtitle: `Volume ${keyword.volume.toLocaleString()} · ${keyword.activeCampaigns} campañas`,
          href: getViewHref(`/keywords?query=${encodeURIComponent(keyword.keyword)}`),
        }));

      return [...routeResults, ...campaignResults, ...advertiserResults, ...keywordResults].slice(0, 16);
    },
    [advertisers, campaigns, getViewHref, keywords, viewMode],
  );

  const markNotificationRead = useCallback((id: string) => {
    setPersistedState((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setPersistedState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    }));
    pushFeedback("Todas las notificaciones fueron marcadas como leídas.");
  }, [pushFeedback]);

  const openHelp = useCallback((topic?: string) => {
    setHelpTopic(topic);
    setHelpOpen(true);
  }, []);

  const saveSettings = useCallback((partial: Partial<DemoSettingsState>) => {
    setPersistedState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        ...partial,
        notifications: {
          ...current.settings.notifications,
          ...(partial.notifications ?? {}),
        },
      },
    }));
  }, []);

  const createAdvertiser = useCallback((form: AdvertiserFormValues) => {
    const advertiser = createAdvertiserFromForm(form);
    setPersistedState((current) => ({
      ...current,
      createdAdvertisers: [advertiser, ...current.createdAdvertisers],
    }));
    pushFeedback(`Anunciante "${advertiser.name}" guardado.`);
    return advertiser;
  }, [pushFeedback]);

  const updateAdvertiser = useCallback((id: string, partial: Partial<Advertiser>) => {
    setPersistedState((current) => ({
      ...current,
      advertiserOverrides: {
        ...current.advertiserOverrides,
        [id]: {
          ...current.advertiserOverrides[id],
          ...partial,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    pushFeedback("Perfil del anunciante actualizado.");
  }, [pushFeedback]);

  const saveCampaignDraft = useCallback((data: CampaignComposerData, id?: string) => {
    const draft = createCampaignFromComposer(data, advertisers, adSpaces, {
      id,
      status: "draft",
    });

    setPersistedState((current) => {
      const existingIndex = current.createdCampaigns.findIndex((item) => item.id === draft.id);
      const nextCampaigns = [...current.createdCampaigns];

      if (existingIndex >= 0) {
        nextCampaigns[existingIndex] = draft;
      } else {
        nextCampaigns.unshift(draft);
      }

      return {
        ...current,
        createdCampaigns: nextCampaigns,
        campaignOverrides: {
          ...current.campaignOverrides,
          [draft.id]: {
            ...current.campaignOverrides[draft.id],
            ...draft,
          },
        },
      };
    });

    pushFeedback(`Borrador "${draft.name}" guardado.`);
    return draft;
  }, [adSpaces, advertisers, pushFeedback]);

  const launchCampaign = useCallback((data: CampaignComposerData, id?: string) => {
    const campaign = createCampaignFromComposer(data, advertisers, adSpaces, {
      id,
      status: "active",
    });

    setPersistedState((current) => {
      const existingIndex = current.createdCampaigns.findIndex((item) => item.id === campaign.id);
      const nextCampaigns = [...current.createdCampaigns];

      if (existingIndex >= 0) {
        nextCampaigns[existingIndex] = campaign;
      } else {
        nextCampaigns.unshift(campaign);
      }

      return {
        ...current,
        createdCampaigns: nextCampaigns,
        campaignOverrides: {
          ...current.campaignOverrides,
          [campaign.id]: {
            ...current.campaignOverrides[campaign.id],
            ...campaign,
          },
        },
        notifications: [
          {
            id: `notif-launch-${campaign.id}`,
            title: "Campaña lanzada",
            description: `${campaign.name} quedó activa para ${campaign.advertiserName}.`,
            href: `/campaigns/${campaign.id}`,
            timeLabel: "Ahora",
            category: "campaign",
            read: false,
          },
          ...current.notifications,
        ],
      };
    });

    pushFeedback(`Campaña "${campaign.name}" lanzada.`);
    return campaign;
  }, [adSpaces, advertisers, pushFeedback]);

  const updateCampaign = useCallback((id: string, partial: Partial<Campaign>) => {
    setPersistedState((current) => ({
      ...current,
      campaignOverrides: {
        ...current.campaignOverrides,
        [id]: {
          ...current.campaignOverrides[id],
          ...partial,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    pushFeedback("Campaña actualizada.");
  }, [pushFeedback]);

  const setCampaignStatus = useCallback((id: string, status: CampaignStatus) => {
    setPersistedState((current) => ({
      ...current,
      campaignOverrides: {
        ...current.campaignOverrides,
        [id]: {
          ...current.campaignOverrides[id],
          status,
          updatedAt: new Date().toISOString(),
        },
      },
      notifications: [
        {
          id: `notif-status-${id}-${Date.now()}`,
          title: `Campaña ${status === "active" ? "reactivada" : "actualizada"}`,
          description: `El estado cambió a ${status}.`,
          href: `/campaigns/${id}`,
          timeLabel: "Ahora",
          category: "campaign",
          read: false,
        },
        ...current.notifications,
      ],
    }));
    pushFeedback(`Estado de campaña: ${status}.`);
  }, [pushFeedback]);

  const updateAdSpace = useCallback((id: string, partial: Partial<AdSpace>) => {
    setPersistedState((current) => ({
      ...current,
      adSpaceOverrides: {
        ...current.adSpaceOverrides,
        [id]: {
          ...current.adSpaceOverrides[id],
          ...partial,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
    pushFeedback("Espacio publicitario actualizado.");
  }, [pushFeedback]);

  const helpSection = useMemo(() => getHelpSection(helpTopic ?? pathname, viewMode), [helpTopic, pathname, viewMode]);

  const value = useMemo<AdConsoleAppContextValue>(() => ({
    dataSource,
    viewMode,
    hydrated,
    campaigns,
    advertisers,
    adSpaces,
    keywords,
    revenueData,
    channelBreakdown,
    dashboardKpis,
    settings,
    notifications,
    unreadNotificationsCount,
    recentSearches,
    searchOpen,
    notificationsOpen,
    helpOpen,
    helpSection,
    openSearch: () => setSearchOpen(true),
    closeSearch: () => setSearchOpen(false),
    openNotifications: () => setNotificationsOpen(true),
    closeNotifications: () => setNotificationsOpen(false),
    openHelp,
    closeHelp: () => {
      setHelpOpen(false);
      setHelpTopic(undefined);
    },
    markNotificationRead,
    markAllNotificationsRead,
    rememberSearch,
    findSearchResults,
    getViewHref,
    copyToClipboard,
    downloadCsv,
    saveSettings,
    createAdvertiser,
    updateAdvertiser,
    saveCampaignDraft,
    launchCampaign,
    updateCampaign,
    setCampaignStatus,
    updateAdSpace,
    pushFeedback,
  }), [
    adSpaces,
    advertisers,
    campaigns,
    channelBreakdown,
    copyToClipboard,
    createAdvertiser,
    dashboardKpis,
    dataSource,
    downloadCsv,
    findSearchResults,
    getViewHref,
    helpOpen,
    helpSection,
    hydrated,
    keywords,
    launchCampaign,
    markAllNotificationsRead,
    markNotificationRead,
    notifications,
    notificationsOpen,
    openHelp,
    recentSearches,
    rememberSearch,
    revenueData,
    saveCampaignDraft,
    saveSettings,
    searchOpen,
    settings,
    setCampaignStatus,
    unreadNotificationsCount,
    updateAdSpace,
    updateAdvertiser,
    updateCampaign,
    viewMode,
    pushFeedback,
  ]);

  return (
    <AdConsoleAppContext.Provider value={value}>
      {children}
      <SearchCommandPalette />
      <NotificationsPanel />
      <HelpPanel />
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {feedbackMessages.map((message) => (
          <div
            key={message.id}
            className="pointer-events-auto rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg"
          >
            {message.message}
          </div>
        ))}
      </div>
    </AdConsoleAppContext.Provider>
  );
}

export function useAdConsoleApp() {
  const context = useContext(AdConsoleAppContext);

  if (!context) {
    throw new Error("useAdConsoleApp must be used within AdConsoleAppProvider");
  }

  return context;
}

function SearchCommandPalette() {
  const { closeSearch, findSearchResults, rememberSearch, recentSearches, searchOpen } = useAdConsoleApp();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const results = useMemo(() => findSearchResults(query), [findSearchResults, query]);

  const handleNavigate = useCallback((href: string, title: string) => {
    rememberSearch(title);
    closeSearch();
    setQuery("");
    router.push(href);
  }, [closeSearch, rememberSearch, router]);

  const searchHints = query.trim()
    ? results
    : recentSearches.map((item) => ({
        id: `recent-${item}`,
        kind: "route" as const,
        title: item,
        subtitle: "Búsqueda reciente",
        href: "",
      }));

  return (
    <Dialog open={searchOpen} onOpenChange={(open) => {
      if (!open) {
        setQuery("");
      }
      if (!open) {
        closeSearch();
      }
    }}>
      <DialogContent className="max-w-2xl p-0" showCloseButton={false}>
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Búsqueda global
          </DialogTitle>
          <DialogDescription>
            Busca campañas, anunciantes, keywords o rutas del prototipo.
          </DialogDescription>
        </DialogHeader>
        <div className="px-5 pt-4">
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej: Medalla, analytics, campaign, budget..."
            className="h-10"
          />
        </div>
        <div className="max-h-[26rem] overflow-y-auto px-3 pb-3 pt-4">
          <div className="space-y-1">
            {searchHints.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-muted-foreground">
                No hay resultados para esta búsqueda.
              </div>
            )}
            {searchHints.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => {
                  if (result.href) {
                    handleNavigate(result.href, result.title);
                  } else {
                    setQuery(result.title);
                  }
                }}
                className="flex w-full items-start justify-between rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{result.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{result.subtitle}</p>
                </div>
                <span className="ml-4 shrink-0 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {result.kind}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NotificationsPanel() {
  const {
    closeNotifications,
    getViewHref,
    markAllNotificationsRead,
    markNotificationRead,
    notifications,
    notificationsOpen,
  } = useAdConsoleApp();
  const router = useRouter();

  return (
    <Sheet open={notificationsOpen} onOpenChange={(open) => !open && closeNotifications()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notificaciones
          </SheetTitle>
          <SheetDescription>
            Alertas operativas y comerciales del prototipo.
          </SheetDescription>
        </SheetHeader>
        <div className="flex items-center justify-between px-4">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {notifications.filter((item) => !item.read).length} sin leer
          </span>
          <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
            Marcar todo
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  markNotificationRead(notification.id);
                  closeNotifications();
                  router.push(getViewHref(notification.href));
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors hover:bg-muted/60",
                  notification.read ? "border-slate-200 bg-white" : "border-primary/20 bg-primary/5",
                )}
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <span className="text-xs text-muted-foreground">{notification.timeLabel}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function HelpPanel() {
  const { closeHelp, getViewHref, helpOpen, helpSection } = useAdConsoleApp();
  const router = useRouter();

  return (
    <Sheet open={helpOpen} onOpenChange={(open) => !open && closeHelp()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <CircleHelp className="h-4 w-4 text-primary" />
            {helpSection.title}
          </SheetTitle>
          <SheetDescription>{helpSection.description}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-4">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Atajos útiles
            </p>
            <div className="mt-3 space-y-2 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Usa la búsqueda global para ir directo a campañas, anunciantes y rutas.
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Las notificaciones simulan alertas operativas persistentes.
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Los cambios mock sobreviven refresh en este navegador.
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {helpSection.links.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => {
                  closeHelp();
                  router.push(getViewHref(link.href));
                }}
                className="flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors hover:bg-muted/60"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {link.href.includes("campaign") ? (
                    <Megaphone className="h-4 w-4" />
                  ) : link.href.includes("advertiser") ? (
                    <Users className="h-4 w-4" />
                  ) : link.href.includes("setting") ? (
                    <Settings2 className="h-4 w-4" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{link.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
