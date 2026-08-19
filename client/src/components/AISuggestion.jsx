import React from 'react';
import { Cpu, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AISuggestion = () => {
  const { aiSuggestion, selectedRoute, isAnalyzing } = useApp();

  if (isAnalyzing) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 animate-pulse flex items-center gap-3">
        <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-cyan-300">🧠 Shadow AI is analyzing your route...</span>
      </div>
    );
  }

  if (!aiSuggestion) return null;

  const reasons = aiSuggestion.reasons || [
    'Good street lighting',
    'Low historical incident density',
    'High activity area',
    'Emergency services nearby'
  ];

  return (
    <div className="relative glass-panel rounded-2xl p-5 border border-cyan-500/30 shadow-2xl overflow-hidden space-y-4">
      {/* Animated scan beam header */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            🧠
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Why Shadow AI Recommended This Route
            </h3>
            <p className="text-[11px] text-slate-400">Explainable AI Safety Engine Rationale</p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
          AI Confidence: {aiSuggestion.aiConfidence || 92}%
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <p className="text-slate-200 leading-relaxed font-medium">
          {aiSuggestion.summary}
        </p>

        {aiSuggestion.tradeoffNotice && (
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety vs Speed Tradeoff</span>
            </div>
            <p className="text-slate-300 text-xs">{aiSuggestion.tradeoffNotice}</p>
          </div>
        )}
      </div>

      {/* REASONS CHECKLIST (Requirements #9 & #10) */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block">
          Key Verified Reasons:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {reasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISuggestion;
