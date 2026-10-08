import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "War Room • Direção Executiva | ONG Rede Cruzada",
  description: "Dashboard Tático de Inteligência Territorial e Monitoramento de Impacto da Rede Cruzada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#f1f5f9] text-slate-900 antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
