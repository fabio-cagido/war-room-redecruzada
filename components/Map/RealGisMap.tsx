"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { TacticalUnit, WidgetConfig, ValueChainStep } from "@/lib/mockData";
import { Layers, MapPin, Phone, Mail, Navigation, X, Globe, Layers2 } from "lucide-react";

interface RealGisMapProps {
  units: TacticalUnit[];
  activeStep: ValueChainStep | null;
  widgets: WidgetConfig[];
  onSelectUnit?: (unit: TacticalUnit) => void;
}

type TileProvider = "arcgis" | "osm" | "satellite";

export const RealGisMap: React.FC<RealGisMapProps> = ({
  units,
  activeStep,
  widgets,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const particlesLayerRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayersRef = useRef<L.Layer[]>([]);

  const [tileProvider, setTileProvider] = useState<TileProvider>("arcgis");
  const [showHubs, setShowHubs] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<TacticalUnit | null>(null);

  // Function to switch tile layers dynamically (100% Free & Open - No API Key)
  const applyTileLayer = (map: L.Map, provider: TileProvider) => {
    // Remove previous tile layers
    currentTileLayersRef.current.forEach((layer) => map.removeLayer(layer));
    currentTileLayersRef.current = [];

    if (provider === "arcgis") {
      // 1. Esri ArcGIS World Light Gray Canvas (Open, Public, Elegant Executive Look - NO API KEY)
      const base = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
          attribution: "Esri ArcGIS",
        }
      ).addTo(map);

      const ref = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 16,
          opacity: 0.9,
        }
      ).addTo(map);

      currentTileLayersRef.current = [base, ref];
    } else if (provider === "osm") {
      // 2. OpenStreetMap Standard (Open & 100% Free - NO API KEY)
      const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "OpenStreetMap",
      }).addTo(map);

      currentTileLayersRef.current = [osm];
    } else if (provider === "satellite") {
      // 3. Esri ArcGIS World Imagery (Satellite - Open & 100% Free - NO API KEY)
      const sat = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
          attribution: "Esri Satellite",
        }
      ).addTo(map);

      currentTileLayersRef.current = [sat];
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on Rio de Janeiro State
      const map = L.map(mapContainerRef.current, {
        center: [-22.65, -43.15],
        zoom: 9.5,
        zoomControl: false,
        attributionControl: false,
      });

      // Apply initial tile layer (ArcGIS Light Gray Canvas by default)
      applyTileLayer(map, "arcgis");

      // Add custom zoom control in top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      const particlesGroup = L.layerGroup().addTo(map);

      markersLayerRef.current = markersGroup;
      particlesLayerRef.current = particlesGroup;
      mapInstanceRef.current = map;

      // Fit bounds to encompass both Capital (Del Castilho, Jacarepaguá, Sampaio) and Serrana (São José)
      const latLngs = units.map((u) => [u.geoPos.lat, u.geoPos.lng] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when user switches provider
  useEffect(() => {
    if (mapInstanceRef.current) {
      applyTileLayer(mapInstanceRef.current, tileProvider);
    }
  }, [tileProvider]);

  // Update Markers & Particles when data, filter, or visibility toggles change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const particlesGroup = particlesLayerRef.current;
    if (!map || !markersGroup || !particlesGroup) return;

    markersGroup.clearLayers();
    particlesGroup.clearLayers();

    units.forEach((unit) => {
      const isHighlighted = !activeStep || activeStep.highlightedUnits.includes(unit.id);
      const opacity = isHighlighted ? 1 : 0.35;

      // --- 1. RENDER STUDENT PARTICLES (NUVEM DE MORADIAS COM GPS REAL) ---
      if (showParticles) {
        unit.particles.forEach((p) => {
          const pLat = unit.geoPos.lat + p.latOffset;
          const pLng = unit.geoPos.lng + p.lngOffset;

          const circle = L.circleMarker([pLat, pLng], {
            radius: p.size + 0.5,
            fillColor: unit.hexColor,
            fillOpacity: isHighlighted ? p.opacity * 0.95 : 0.15,
            stroke: false,
          });

          particlesGroup.addLayer(circle);
        });
      }

      // --- 2. RENDER UNIT HUBS (DIV ICON COM CARD/BADGE) ---
      if (showHubs) {
        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          iconSize: [160, 80],
          iconAnchor: [80, 40],
          html: `
            <div style="opacity: ${opacity}; transition: opacity 0.3s; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <!-- Floating Card Mini Preview -->
              <div style="
                background: rgba(255, 255, 255, 0.96);
                border: 2px solid ${unit.hexColor};
                border-radius: 8px;
                padding: 4px 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                white-space: nowrap;
                text-align: center;
                margin-bottom: 6px;
                backdrop-filter: blur(4px);
              ">
                <div style="font-weight: 800; font-size: 11px; color: ${unit.hexColor}; line-height: 1.2;">
                  ${unit.code}
                </div>
                <div style="font-size: 10px; font-weight: 600; color: #334155;">
                  ${unit.kpis.alunos} alunos • ${unit.kpis.frequencia}% freq
                </div>
              </div>

              <!-- Central Pulsing Node -->
              <div style="position: relative; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
                <div style="
                  position: absolute;
                  width: 32px;
                  height: 32px;
                  border-radius: 9999px;
                  background: ${unit.hexColor};
                  opacity: 0.3;
                  animation: radar-pulse 2.5s infinite;
                "></div>
                <div style="
                  width: 14px;
                  height: 14px;
                  border-radius: 9999px;
                  background: ${unit.hexColor};
                  border: 2px solid #ffffff;
                  box-shadow: 0 0 6px ${unit.hexColor};
                "></div>
              </div>
            </div>
          `,
        });

        const marker = L.marker([unit.geoPos.lat, unit.geoPos.lng], { icon: customIcon });

        marker.on("click", () => {
          setSelectedUnit(unit);
        });

        markersGroup.addLayer(marker);
      }
    });
  }, [units, activeStep, showHubs, showParticles]);

  // Map view shortcuts
  const handleFitAll = () => {
    if (!mapInstanceRef.current) return;
    const latLngs = units.map((u) => [u.geoPos.lat, u.geoPos.lng] as [number, number]);
    mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
  };

  const handleFocusCapital = () => {
    if (!mapInstanceRef.current) return;
    const capitalUnits = units.filter((u) => u.id !== "sjvrp");
    const latLngs = capitalUnits.map((u) => [u.geoPos.lat, u.geoPos.lng] as [number, number]);
    mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [60, 60] });
  };

  const handleFocusSerrana = () => {
    if (!mapInstanceRef.current) return;
    const sj = units.find((u) => u.id === "sjvrp");
    if (sj) {
      mapInstanceRef.current.setView([sj.geoPos.lat, sj.geoPos.lng], 13);
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-[#f8fafc]">
      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Navigation Controls (Shortcuts) */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <button
          onClick={handleFitAll}
          className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5 text-orange-600" />
          <span>Ver Todo o RJ (4 Polos)</span>
        </button>

        <button
          onClick={handleFocusCapital}
          className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-sky-600" />
          <span>Capital (Nova América / CDD / Riachuelo)</span>
        </button>

        <button
          onClick={handleFocusSerrana}
          className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Região Serrana (São José)</span>
        </button>
      </div>

      {/* Top Center-Right: FREE TILE PROVIDER PICKER (NO API KEY) */}
      <div className="absolute top-4 right-14 z-10 hidden sm:flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
        <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
          <Layers2 className="w-3 h-3 text-orange-600" />
          <span>Camada Base:</span>
        </span>
        <button
          onClick={() => setTileProvider("arcgis")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            tileProvider === "arcgis"
              ? "bg-[#ea580c] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="Esri ArcGIS Light Gray Canvas (Executivo Limpo - Aberto)"
        >
          ArcGIS Light
        </button>
        <button
          onClick={() => setTileProvider("osm")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            tileProvider === "osm"
              ? "bg-[#ea580c] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="OpenStreetMap Standard (Aberto)"
        >
          OpenStreetMap
        </button>
        <button
          onClick={() => setTileProvider("satellite")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
            tileProvider === "satellite"
              ? "bg-[#ea580c] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="Esri ArcGIS World Imagery Satélite (Aberto)"
        >
          Satélite
        </button>
      </div>

      {/* Bottom Left Layers Legend */}
      <div className="absolute left-4 bottom-4 z-10 bg-white/95 border border-slate-200 rounded-xl p-2.5 shadow-md flex items-center gap-4 text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-slate-800 font-bold uppercase text-[10px] tracking-wider">
          <Layers className="w-3.5 h-3.5 text-orange-600" />
          <span>CAMADAS GIS:</span>
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
            Polos Oficiais
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
            Nuvem de Alunos (GPS Real)
          </span>
        </label>
      </div>

      {/* Detail Dossier Drawer (Quando clica em um pino no mapa) */}
      {selectedUnit && (
        <div
          className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-sm flex items-center justify-end animate-fadeIn"
          onClick={() => setSelectedUnit(null)}
        >
          <div
            className="w-full max-w-md h-full bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl text-slate-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
                    Polo Oficial Homologado
                  </span>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {selectedUnit.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">{selectedUnit.project}</p>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Endereço & Contatos Oficiais */}
              <div className="mt-4 p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{selectedUnit.address}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-bold text-slate-900 font-mono">{selectedUnit.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-orange-600 shrink-0" />
                  <a
                    href={`mailto:${selectedUnit.email}`}
                    className="font-medium text-orange-700 hover:underline"
                  >
                    {selectedUnit.email}
                  </a>
                </div>
              </div>

              {/* KPIs Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
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

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] uppercase text-emerald-800 font-bold block">
                    Frequência Média
                  </span>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono">
                    {selectedUnit.kpis.frequencia}%
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                    Meta institucional batida
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <span className="text-[10px] uppercase text-amber-800 font-bold block">
                    Autonomia BNCC
                  </span>
                  <span className="text-xl font-extrabold text-amber-950 font-mono">
                    {selectedUnit.kpis.autonomia} / 5
                  </span>
                  <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                    Nota pedagógica
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
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
              <div className="mt-4">
                <h4 className="text-xs uppercase font-bold text-slate-700 tracking-wider mb-2">
                  Projetos Core no Território
                </h4>
                <div className="space-y-1.5">
                  {selectedUnit.programs.map((prog, i) => (
                    <div
                      key={i}
                      className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-center gap-2 font-medium"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>{prog}</span>
                    </div>
                  ))}
                </div>
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
