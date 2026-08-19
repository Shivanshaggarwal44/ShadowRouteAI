import React from 'react';
import { Shield, Zap, Clock, Lightbulb, Users, ShieldCheck, Cross, Navigation, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RouteResultCard = ({ onStartJourney }) => {
  const { routes, selectedRoute, setSelectedRoute, aiSuggestion } = useApp();

  const activeRoute = selectedRoute || routes[0];

  if (!activeRoute) return null;

  const safetyScore = activeRoute.currentSafetyScore || 91;
  const isSafest = safetyScore >= 75;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-xl space-y-4 font-sans text-slate-800">
      
      {/* 3 Route Comparison Selector Pills (#17) */}
      <div className="grid grid-cols-3 gap-2">
        {routes.slice(0, 3).map((route) => {
          const isSelected = activeRoute.id === route.id;
          const score = route.currentSafetyScore || 85;

          return (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold truncate">
                  {route.type === 'SAFE' ? '🛡️ Safest' : route.type === 'FAST' ? '⚡ Fastest' : '🟡 Alt'}
                </span>
                <span className={`text-[11px] font-bold ${score >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {score}/100
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 mt-1">
                {route.adjustedEta || route.baseEtaMinutes} min
              </span>
            </button>
          );
        })}
      </div>

      {/* DOMINANT SAFETY SCORE HEADER (#15 & #16) */}
      <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-center relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
          <span className="text-3xl font-black tracking-tight text-white">{safetyScore}/100</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
            isSafest ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
          }`}>
            {activeRoute.currentRiskLevel || 'LOW RISK'}
          </span>
        </div>

        <div className="text-xs text-slate-300 font-medium">
          {activeRoute.adjustedEta || 18} min • {activeRoute.distanceKm || '6.8'} km
        </div>

        <div className="text-xs text-emerald-400 font-bold bg-emerald-950/60 py-1.5 px-3 rounded-lg border border-emerald-800/80 inline-block">
          💡 3 minutes slower, significantly safer
        </div>
      </div>

      {/* SAFETY FACTORS WITH ICONS (#18 & #19) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Why this route is safer:
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium text-slate-700">Better street lighting</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <Users className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-medium text-slate-700">More active streets</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-medium text-slate-700">Lower historical risk</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <Cross className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="font-medium text-slate-700">Emergency access near</span>
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION BUTTON (#14 & #16) */}
      <button
        onClick={onStartJourney}
        className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-98 flex items-center justify-center gap-2"
      >
        <Navigation className="w-4 h-4 fill-current" />
        <span>Start Safe Journey</span>
      </button>

    </div>
  );
};

export default RouteResultCard;
