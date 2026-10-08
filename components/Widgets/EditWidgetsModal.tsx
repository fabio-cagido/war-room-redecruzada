"use client";

import React from "react";
import { WidgetConfig } from "@/lib/mockData";
import { X, Check, Sliders } from "lucide-react";

interface EditWidgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
  onResetDefaults: () => void;
}

export const EditWidgetsModal: React.FC<EditWidgetsModalProps> = ({
  isOpen,
  onClose,
  widgets,
  onToggleWidget,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const activeCount = widgets.filter((w) => w.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Personalizar Widgets do Mapa
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Configure os KPIs exibidos nos Floating Cards das 4 unidades
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100 font-medium">
            <span>Indicadores Disponíveis ({activeCount} ativos)</span>
            <span className="text-[11px] text-orange-600 font-semibold">Recomendado: 3 a 4 indicadores</span>
          </div>

          <div className="space-y-2">
            {widgets.map((widget) => {
              return (
                <div
                  key={widget.id}
                  onClick={() => onToggleWidget(widget.id as string)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    widget.enabled
                      ? "bg-orange-50/60 border-orange-300 text-slate-900 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        widget.enabled
                          ? "bg-orange-600 border-orange-600 text-white font-bold shadow-sm"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {widget.enabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{widget.label}</span>
                      <span className="ml-2 text-[11px] text-slate-400 font-medium">
                        {widget.unit ? `(${widget.unit})` : ""}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    ex: {widget.format(widget.id === "frequencia" ? 94 : widget.id === "autonomia" ? 4.2 : widget.id === "alunos" ? 340 : 12)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Card Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2.5">
              Preview do Floating Card (Unidade SNA)
            </span>
            <div className="w-52 mx-auto bg-white border-2 border-sky-500 rounded-xl p-3 text-center shadow-md">
              <span className="text-[11px] font-extrabold text-sky-800 tracking-wider block bg-sky-50 rounded-lg py-1 border border-sky-100 mb-2">
                UNIDADE SNA
              </span>
              <div className="space-y-1.5 text-left text-[11px]">
                {widgets
                  .filter((w) => w.enabled)
                  .map((w) => (
                    <div key={w.id} className="flex justify-between text-slate-700">
                      <span className="text-slate-500 font-medium text-[10px]">{w.label}:</span>
                      <span className="font-extrabold text-slate-900 font-mono">
                        {w.format(w.id === "frequencia" ? 94 : w.id === "autonomia" ? 4.2 : w.id === "alunos" ? 340 : 20)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onResetDefaults}
            className="text-xs font-semibold text-slate-500 hover:text-orange-600 underline cursor-pointer"
          >
            Restaurar Padrões
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            Concluir &amp; Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
