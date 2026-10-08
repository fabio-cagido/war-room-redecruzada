"use client";

import React, { useState } from "react";
import {
  MOCK_UNITS,
  VALUE_CHAIN_STEPS,
  INITIAL_WIDGET_CONFIGS,
  WidgetConfig,
} from "@/lib/mockData";
import dynamic from "next/dynamic";
import { ValueChainChevrons } from "@/components/HUD/ValueChainChevrons";
import { EditWidgetsModal } from "@/components/Widgets/EditWidgetsModal";
import {
  Settings,
  BookOpen,
  Users,
  Award,
  Activity,
  Utensils,
  Globe,
  Compass,
} from "lucide-react";

// Client-only dynamic load for interactive Leaflet Real GIS Map
const RealGisMap = dynamic(
  () => import("@/components/Map/RealGisMap").then((mod) => mod.RealGisMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[620px] rounded-2xl border border-slate-200 bg-[#f8fafc] flex items-center justify-center">
        <div className="text-xs font-mono text-slate-500 animate-pulse tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>INICIALIZANDO MAPA REAL DO RIO DE JANEIRO...</span>
        </div>
      </div>
    ),
  }
);

// Client-only dynamic load for stylized tactical map
const TacticalMap = dynamic(
  () => import("@/components/Map/TacticalMap").then((mod) => mod.TacticalMap),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-[620px] rounded-2xl border border-slate-200 bg-[#f8fafc] flex items-center justify-center">
        <div className="text-xs font-mono text-slate-500 animate-pulse tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>CARREGANDO MAPA TÁTICO...</span>
        </div>
      </div>
    ),
  }
);

export default function WarRoomDashboard() {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<WidgetConfig[]>(INITIAL_WIDGET_CONFIGS);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"warroom" | "panorama" | "polos">("warroom");
  const [mapMode, setMapMode] = useState<"gis" | "tactical">("gis");

  // Active step object
  const activeStep = selectedStepId
    ? VALUE_CHAIN_STEPS.find((s) => s.id === selectedStepId) || null
    : null;

  // Toggle widget visibility
  const handleToggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  // Reset to default 3 widgets
  const handleResetDefaults = () => {
    setWidgets(INITIAL_WIDGET_CONFIGS);
  };

  // Global KPIs summary
  const totalAlunos = MOCK_UNITS.reduce((acc, u) => acc + u.kpis.alunos, 0);
  const mediaFreq = (
    MOCK_UNITS.reduce((acc, u) => acc + u.kpis.frequencia, 0) / MOCK_UNITS.length
  ).toFixed(1);
  const mediaAutonomia = (
    MOCK_UNITS.reduce((acc, u) => acc + u.kpis.autonomia, 0) / MOCK_UNITS.length
  ).toFixed(2);
  const totalRefeicoes = MOCK_UNITS.reduce((acc, u) => acc + u.kpis.refeicoes, 0);

  // Deterministic thousand separator to prevent SSR/client locale mismatch
  const formatInt = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col">
      {/* ========================================================= */}
      {/* 1. TOP NAVBAR (MATCHING DASHBOARD PEDAGÓGICO LIGHT SCHEME) */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea580c] to-[#f97316] text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                REDE CRUZADA
              </div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">
                War Room • Direção Executiva 2026
              </h1>
            </div>
          </div>

          {/* Navigation Pills (Matching Screenshot Style) */}
          <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("warroom")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "warroom"
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mapa Geográfico RJ
            </button>
            <button
              onClick={() => setActiveTab("panorama")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "panorama"
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cadeia de Valor
            </button>
            <button
              onClick={() => setActiveTab("polos")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "polos"
                  ? "bg-[#ea580c] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unidades &amp; Territórios
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsWidgetModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 hover:border-orange-500 bg-white hover:bg-orange-50 text-slate-700 hover:text-orange-700 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Settings className="w-4 h-4 text-orange-600" />
              <span>EDITAR WIDGETS DO MAPA</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTAINER */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 space-y-5">
        {/* Title & Live Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Panorama Geral • War Room
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Georreferenciamento oficial dos 4 polos: Shopping Nova América, Cidade de Deus, Riachuelo e São José do Vale do Rio Preto
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 self-start sm:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dados e Coordenadas Reais</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. HUD SUPERIOR (CADEIA DE VALOR / CHEVRONS) */}
        {/* ========================================================= */}
        <section aria-label="Cadeia de Valor">
          <ValueChainChevrons
            selectedStepId={selectedStepId}
            onSelectStep={setSelectedStepId}
          />
        </section>

        {/* ========================================================= */}
        {/* 3. MAP SELECTOR & INTERACTIVE MAP SECTION */}
        {/* ========================================================= */}
        <section aria-label="Mapa Territorial RJ" className="w-full space-y-2.5">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setMapMode("gis")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  mapMode === "gis"
                    ? "bg-[#ea580c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>🌍 Mapa Real Interativo (OpenStreetMap / Leaflet)</span>
              </button>

              <button
                type="button"
                onClick={() => setMapMode("tactical")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  mapMode === "tactical"
                    ? "bg-[#ea580c] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>🎯 Visão de Radar Tático (Isométrica)</span>
              </button>
            </div>

            <div className="text-[11px] font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              {mapMode === "gis"
                ? "📍 4 Polos plotados com ruas, satélite e coordenadas GPS exatas"
                : "📡 Visão sintética de comando estratégico"}
            </div>
          </div>

          {/* Active Map View */}
          {mapMode === "gis" ? (
            <RealGisMap
              units={MOCK_UNITS}
              activeStep={activeStep}
              widgets={widgets}
            />
          ) : (
            <TacticalMap
              units={MOCK_UNITS}
              activeStep={activeStep}
              widgets={widgets}
            />
          )}
        </section>

        {/* ========================================================= */}
        {/* 4. EXECUTIVE SUMMARY RIBBON */}
        {/* ========================================================= */}
        <footer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Card 1: Alunos */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Alunos Avaliados / Ativos
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {formatInt(totalAlunos)}
              </span>
              <span className="text-[11px] text-slate-500 block font-medium">
                4 polos comunitários
              </span>
            </div>
          </div>

          {/* Card 2: Autonomia BNCC */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Média Geral de Autonomia
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {mediaAutonomia} / 5
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                Desempenho satisfatório BNCC
              </span>
            </div>
          </div>

          {/* Card 3: Frequência */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Frequência Global
              </span>
              <span className="text-xl font-black text-emerald-700 font-mono">
                {mediaFreq}%
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Acima da meta institucional (&gt;85%)
              </span>
            </div>
          </div>

          {/* Card 4: Refeições */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Refeições / Dia Servidas
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {formatInt(totalRefeicoes)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Segurança alimentar garantida
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* ========================================================= */}
      {/* 5. MODAL: EDIT WIDGETS */}
      {/* ========================================================= */}
      <EditWidgetsModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
