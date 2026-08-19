import React from 'react';
import { Shield, Clock, Navigation, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RouteCard = ({ route, isSelected, onSelect, onStartNav }) => {
  const { isNavigating } = useApp();

  const getScoreTheme = (score) => {
    if (score >= 80) return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/40', tag: 'bg-emerald-500 text-slate-950' };
    if (score >= 60) return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/40', tag: 'bg-amber-500 text-slate-950' };
    return { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/40', tag: 'bg-red-500 text-slate-950' };
  };

  const theme = getScoreTheme(route.currentSafetyScore || route.safetyScore);

  return (
    <div
      onClick={onSelect}
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'border-cyan-400 bg-slate-900/90 shadow-2xl shadow-cyan-500/20 ring-1 ring-cyan-500/50'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      {/* Top Banner Tag if recommended */}
      {route.isRecommended && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl font-mono tracking-wider shadow-md">
          ★ Recommended Safe Choice
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">
            {route.tag || route.type}
          </span>
          <h4 className="text-base font-bold text-slate-100 mt-0.5">{route.name}</h4>
        </div>

        <div className={`px-3 py-1.5 rounded-xl border font-mono font-extrabold text-sm flex items-center gap-1.5 ${theme.bg} ${theme.text} ${theme.border}`}>
          <Shield className="w-4 h-4 fill-current" />
          <span>{route.currentSafetyScore || route.safetyScore}/100</span>
        </div>
      </div>

      {/* ETA & Distance Row */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-mono block">ESTIMATED TIME</span>
          <span className="font-bold text-slate-200 text-sm">{route.adjustedEta || route.baseEtaMinutes} min</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-mono block">DISTANCE</span>
          <span className="font-bold text-slate-200 text-sm">{route.distanceKm} km</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-mono block">RISK TIER</span>
          <span className={`font-bold text-xs ${theme.text}`}>{route.currentRiskLevel || route.riskLevel}</span>
        </div>
      </div>

      {/* Key Factors */}
      <div className="space-y-1 mb-4">
        <span className="text-[11px] font-mono text-slate-400 block font-semibold">Key Route Highlights:</span>
        {route.factors?.slice(0, 3).map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
            <span className="truncate">{f}</span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartNav();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:opacity-95 transition active:scale-98"
        >
          <Navigation className="w-4 h-4 fill-slate-950" />
          <span>{isNavigating ? 'Navigating This Safe Route...' : 'Start Safe Navigation'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default RouteCard;
