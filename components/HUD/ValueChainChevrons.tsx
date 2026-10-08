"use client";

import React from "react";
import { VALUE_CHAIN_STEPS } from "@/lib/mockData";
import { ChevronRight } from "lucide-react";

interface ValueChainChevronsProps {
  selectedStepId: string | null;
  onSelectStep: (stepId: string | null) => void;
}

export const ValueChainChevrons: React.FC<ValueChainChevronsProps> = ({
  selectedStepId,
  onSelectStep,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {VALUE_CHAIN_STEPS.map((step, index) => {
          const isSelected = selectedStepId === step.id;

          // Theme styling for light design system
          const themeStyles = {
            cyan: {
              borderActive: "border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/70 shadow-md",
              accent: "text-sky-700",
              badge: "bg-sky-100 text-sky-800 border-sky-300",
            },
            orange: {
              borderActive: "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/70 shadow-md",
              accent: "text-orange-700",
              badge: "bg-orange-100 text-orange-800 border-orange-300",
            },
            green: {
              borderActive: "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/70 shadow-md",
              accent: "text-emerald-700",
              badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
            },
            yellow: {
              borderActive: "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/70 shadow-md",
              accent: "text-amber-800",
              badge: "bg-amber-100 text-amber-800 border-amber-300",
            },
          }[step.color];

          return (
            <div key={step.id} className="relative group">
              <button
                type="button"
                onClick={() => onSelectStep(isSelected ? null : step.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-[92px] ${
                  isSelected
                    ? `${themeStyles.borderActive} scale-[1.01]`
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Top Title Line */}
                <div className="flex items-start justify-between gap-1 z-10">
                  <span className="text-[12px] font-bold text-slate-800 leading-snug tracking-wide line-clamp-2">
                    {step.title}
                  </span>
                  {isSelected && (
                    <span
                      className={`shrink-0 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${themeStyles.badge}`}
                    >
                      Ativo
                    </span>
                  )}
                </div>

                {/* Bottom Metric / Subtitle */}
                <div className="flex items-end justify-between z-10 mt-1">
                  <span
                    className={`text-[12px] font-bold tracking-tight ${
                      isSelected ? themeStyles.accent : "text-slate-600"
                    }`}
                  >
                    {step.metric}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Fase {step.stepNumber}/4
                  </span>
                </div>
              </button>

              {/* Connecting Chevron Arrow between steps on large screens */}
              {index < VALUE_CHAIN_STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-slate-300">
                  <ChevronRight className="w-5 h-5 drop-shadow-sm" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info bar when a step is selected */}
      {selectedStepId && (
        <div className="mt-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between text-xs text-slate-700 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-orange-600">
              Foco Estratégico:
            </span>
            <span className="text-slate-600 font-medium">
              {VALUE_CHAIN_STEPS.find((s) => s.id === selectedStepId)?.strategicGoal}
            </span>
          </div>
          <button
            onClick={() => onSelectStep(null)}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline cursor-pointer"
          >
            Limpar filtro (Ver Todas)
          </button>
        </div>
      )}
    </div>
  );
};
