"use client";

import React, { useState, useEffect } from "react";
import { TacticalUnit, WidgetConfig, ValueChainStep } from "@/lib/mockData";
import { Layers, X, Info, Sparkles } from "lucide-react";

interface TacticalMapProps {
  units: TacticalUnit[];
  activeStep: ValueChainStep | null;
  widgets: WidgetConfig[];
  onSelectUnit?: (unit: TacticalUnit) => void;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  units,
  activeStep,
  widgets,
}) => {
  const [showHubs, setShowHubs] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<TacticalUnit | null>(null);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Active widgets to display on the cards
  const activeWidgets = widgets.filter((w) => w.enabled);

  return (
    <div className="relative w-full h-[620px] rounded-2xl border border-slate-200 bg-[#f8fafc] overflow-hidden shadow-sm select-none">
      {/* Background Tactical Radar Grid - Clean Light Slate */}
      <div className="absolute inset-0 bg-tactical-grid-light opacity-80 pointer-events-none" />

      {/* Subtle Coordinate / Telemetry Watermarks */}
      <div className="absolute top-3 left-4 text-[10px] font-mono text-slate-400 pointer-events-none tracking-widest font-semibold">
        TERRITÓRIO RJ // 22°54&apos;10&quot;S 43°12&apos;27&quot;W // MAPA OPERACIONAL
      </div>
      <div className="absolute top-3 right-4 text-[10px] font-mono text-slate-400 pointer-events-none tracking-widest hidden sm:block font-semibold">
        REDE CRUZADA // 4 POLOS ATIVOS
      </div>

      {/* SVG Layer: Rio de Janeiro Shoreline & Coastline Polyline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oceanGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Ocean / Guanabara Bay Shoreline Polygon */}
        <polygon
          points="
            0,620 
            0,510 
            160,500 
            320,530 
            480,480 
            650,500 
            800,470 
            1000,510 
            1200,460 
            1400,490 
            1600,460 
            1600,620
          "
          fill="url(#oceanGradientLight)"
        />

        {/* Coastline Dashed Blue Line */}
        <polyline
          points="
            0,510 
            160,500 
            320,530 
            480,480 
            650,500 
            800,470 
            1000,510 
            1200,460 
            1400,490 
            1600,460
          "
          fill="none"
          stroke="#0284c7"
          strokeWidth="2"
          strokeDasharray="6,5"
          strokeOpacity="0.75"
        />

        {/* Secondary Shoreline contour */}
        <polyline
          points="
            0,525 
            160,515 
            320,545 
            480,495 
            650,515 
            800,485 
            1000,525 
            1200,475 
            1400,505 
            1600,475
          "
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="3,6"
          strokeOpacity="0.5"
        />

        {/* Subtle Crosshairs */}
        <circle cx="20%" cy="40%" r="2" fill="#0284c7" opacity="0.4" />
        <circle cx="50%" cy="30%" r="2" fill="#0284c7" opacity="0.4" />
        <circle cx="80%" cy="40%" r="2" fill="#0284c7" opacity="0.4" />
      </svg>

      {/* Ocean Watermark Label */}
      <div className="absolute right-8 bottom-6 text-[11px] font-mono tracking-widest text-sky-800/60 pointer-events-none uppercase font-bold">
        OCEANO ATLÂNTICO / BAÍA DE GUANABARA
      </div>

      {/* Main Units and Floating Cards Canvas */}
      <div className="absolute inset-0">
        {units.map((unit) => {
          const isHighlightedByStep =
            !activeStep || activeStep.highlightedUnits.includes(unit.id);
          const isHovered = hoveredUnitId === unit.id;

          // Theme styling per unit in Light Mode
          const colors = {
            cyan: {
              cardBorder: "border-sky-500 shadow-md",
              headerText: "text-sky-800",
              headerBg: "bg-sky-50 border-b border-sky-100",
              pinBg: "bg-sky-500",
              radar: "border-sky-500/35 bg-sky-500/15",
              particle: "#0284c7",
              connector: "border-sky-500",
            },
            orange: {
              cardBorder: "border-orange-500 shadow-md",
              headerText: "text-orange-800",
              headerBg: "bg-orange-50 border-b border-orange-100",
              pinBg: "bg-orange-500",
              radar: "border-orange-500/35 bg-orange-500/15",
              particle: "#ea580c",
              connector: "border-orange-500",
            },
            green: {
              cardBorder: "border-emerald-500 shadow-md",
              headerText: "text-emerald-800",
              headerBg: "bg-emerald-50 border-b border-emerald-100",
              pinBg: "bg-emerald-500",
              radar: "border-emerald-500/35 bg-emerald-500/15",
              particle: "#059669",
              connector: "border-emerald-500",
            },
            yellow: {
              cardBorder: "border-amber-500 shadow-md",
              headerText: "text-amber-800",
              headerBg: "bg-amber-50 border-b border-amber-100",
              pinBg: "bg-amber-500",
              radar: "border-amber-500/35 bg-amber-500/15",
              particle: "#d97706",
              connector: "border-amber-500",
            },
          }[unit.color];

          return (
            <div
              key={unit.id}
              className={`absolute transition-all duration-300 ${
                isHighlightedByStep ? "opacity-100" : "opacity-30 grayscale-[50%]"
              }`}
              style={{
                left: `${unit.tacticalPos.x}%`,
                top: `${unit.tacticalPos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseEnter={() => setHoveredUnitId(unit.id)}
              onMouseLeave={() => setHoveredUnitId(null)}
            >
              {/* --- LAYER 1: Particle Cloud (Moradias dos Alunos) --- */}
              {showParticles && isMounted && (
                <div
                  suppressHydrationWarning
                  className="absolute inset-0 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                >
                  {unit.particles.map((p) => (
                    <div
                      key={p.id}
                      suppressHydrationWarning
                      className="absolute rounded-full transition-transform duration-700 pointer-events-none"
                      style={{
                        width: `${p.size + 0.5}px`,
                        height: `${p.size + 0.5}px`,
                        backgroundColor: colors.particle,
                        opacity: isHovered ? Math.min(1, Number((p.opacity * 1.4).toFixed(2))) : p.opacity,
                        left: `${p.offsetX}px`,
                        top: `${p.offsetY}px`,
                        boxShadow: `0 0 3px ${colors.particle}`,
                        transform: isHovered ? "scale(1.3)" : "scale(1)",
                      }}
                    />
                  ))}

                  {/* Outer Dotted Perimeter Ring */}
                  <div
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed pointer-events-none transition-all duration-300 ${
                      colors.radar
                    }`}
                    style={{
                      width: "150px",
                      height: "150px",
                      opacity: isHovered ? 0.8 : 0.45,
                    }}
                  />
                </div>
              )}

              {/* --- LAYER 2: Radar Pulse and Central Hub Pin --- */}
              {showHubs && (
                <div
                  className="relative z-20 cursor-pointer flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  onClick={() => setSelectedUnit(unit)}
                >
                  {/* Concentric Radar Ring Animations */}
                  <div
                    className={`absolute rounded-full animate-radar pointer-events-none ${colors.radar}`}
                    style={{ width: "64px", height: "64px" }}
                  />
                  <div
                    className={`absolute rounded-full border pointer-events-none ${colors.radar}`}
                    style={{ width: "36px", height: "36px" }}
                  />

                  {/* Central Node Dot */}
                  <div
                    className={`w-5 h-5 rounded-full ${colors.pinBg} border-2 border-white shadow-md transition-transform duration-200 flex items-center justify-center ${
                      isHovered ? "scale-125" : "scale-100"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
              )}

              {/* --- LAYER 3: Vertical Leader Line (Connector) --- */}
              <div
                className={`absolute left-0 bottom-6 -translate-x-1/2 w-0.5 h-16 border-l-2 border-dashed ${colors.connector} pointer-events-none z-10`}
              />

              {/* --- LAYER 4: Floating HUD Card (Clean Light White Card) --- */}
              <div
                className={`absolute left-0 bottom-22 -translate-x-1/2 z-30 w-44 rounded-xl bg-white/95 backdrop-blur-md border-2 ${
                  colors.cardBorder
                } transition-all duration-200 cursor-pointer hover:scale-105 shadow-md ${
                  isHovered ? "ring-2 ring-slate-400/40" : ""
                }`}
                onClick={() => setSelectedUnit(unit)}
              >
                {/* Card Title Header */}
                <div className={`px-2.5 py-1.5 text-center ${colors.headerBg} rounded-t-[10px]`}>
                  <h3 className={`text-[11px] font-extrabold uppercase tracking-wider ${colors.headerText}`}>
                    {unit.code}
                  </h3>
                </div>

                {/* Card KPIs Body */}
                <div className="p-2.5 space-y-1.5 text-[11px]">
                  {activeWidgets.map((widget) => {
                    const value = unit.kpis[widget.id];
                    return (
                      <div
                        key={widget.id}
                        className="flex items-center justify-between text-slate-700"
                      >
                        <span className="text-slate-500 font-semibold text-[10px]">
                          {widget.label}:
                        </span>
                        <span className="font-extrabold text-slate-900 font-mono">
                          {widget.format(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- LAYER 5: Bottom Left Map Layers Legend (Clean Light Badge) --- */}
      <div className="absolute left-4 bottom-4 z-40 bg-white/95 border border-slate-200 rounded-xl p-2.5 shadow-md flex items-center gap-4 text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
          <Layers className="w-3.5 h-3.5 text-orange-600" />
          <span>CAMADAS DO MAPA:</span>
        </div>

        {/* Toggle Hubs */}
        <label
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 cursor-pointer select-none"
          onClick={() => setShowHubs(!showHubs)}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              showHubs ? "bg-sky-500 shadow-sm" : "bg-slate-300"
            }`}
          />
          <span className={showHubs ? "text-slate-800" : "text-slate-400 line-through"}>
            Hub Unidade
          </span>
        </label>

        {/* Toggle Particles */}
        <label
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 cursor-pointer select-none"
          onClick={() => setShowParticles(!showParticles)}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              showParticles ? "bg-orange-500 shadow-sm" : "bg-slate-300"
            }`}
          />
          <span className={showParticles ? "text-slate-800" : "text-slate-400 line-through"}>
            Nuvem Alunos (Moradias)
          </span>
        </label>
      </div>

      {/* --- UNIT DOSSIER DRAWER (Clean Light Detail Modal) --- */}
      {selectedUnit && (
        <div
          className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end animate-fadeIn"
          onClick={() => setSelectedUnit(null)}
        >
          <div
            className="w-full max-w-md h-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl text-slate-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
                    Dossiê Territorial Tático
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {selectedUnit.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedUnit.region}</p>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* KPIs Grid */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <span className="text-[10px] uppercase text-sky-800 font-bold block">
                    Alunos Atendidos
                  </span>
                  <span className="text-xl font-extrabold text-sky-950 font-mono">
                    {selectedUnit.kpis.alunos}
                  </span>
                  <span className="text-[10px] text-sky-700 block mt-0.5 font-medium">
                    {selectedUnit.kpis.vagasOcupadas}% ocupação
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-[10px] uppercase text-emerald-800 font-bold block">
                    Frequência Média
                  </span>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono">
                    {selectedUnit.kpis.frequencia}%
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                    Meta: &gt;85%
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="text-[10px] uppercase text-amber-800 font-bold block">
                    Autonomia BNCC
                  </span>
                  <span className="text-xl font-extrabold text-amber-950 font-mono">
                    {selectedUnit.kpis.autonomia} / 5
                  </span>
                  <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                    Avaliação ativa
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-100">
                  <span className="text-[10px] uppercase text-orange-800 font-bold block">
                    Refeições Diárias
                  </span>
                  <span className="text-xl font-extrabold text-orange-950 font-mono">
                    {selectedUnit.kpis.refeicoes}
                  </span>
                  <span className="text-[10px] text-orange-700 block mt-0.5 font-medium">
                    Segurança alimentar
                  </span>
                </div>
              </div>

              {/* Programs */}
              <div className="mt-5">
                <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-2">
                  Programas &amp; Projetos Ativos
                </h4>
                <div className="space-y-1.5">
                  {selectedUnit.programs.map((prog, i) => (
                    <div
                      key={i}
                      className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-2 font-medium"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>{prog}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Territorial Insight */}
              <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 text-orange-600 font-bold mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Raio de Atendimento Comunitário</span>
                </div>
                <span>
                  A nuvem territorial indica {selectedUnit.particles.length} núcleos familiares mapeados em um raio de até 1.8km em torno desta unidade.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setSelectedUnit(null)}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Fechar Dossiê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
