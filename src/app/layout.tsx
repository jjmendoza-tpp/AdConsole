import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { TopHeader } from "@/components/shell/top-header";
import { AdConsoleAppProvider } from "@/components/shell/adconsole-app-provider";
import { getServerAdConsoleRequestContext } from "@/lib/adconsole/server-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ad Console — Consola de Anuncios",
  description: "Plataforma SaaS de gestión de anuncios dentro de conversaciones AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const context = await getServerAdConsoleRequestContext();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AdConsoleAppProvider
          defaultViewMode={context.viewMode}
          dataSource={context.mode}
        >
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <TopHeader />
                <main className="flex-1 overflow-auto p-6">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </AdConsoleAppProvider>
      </body>
    </html>
  );
}
