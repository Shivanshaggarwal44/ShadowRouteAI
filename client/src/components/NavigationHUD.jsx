import React from 'react';
import { Shield, Navigation, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NavigationHUD = ({ onStop, onSimulateDeviation }) => {
  const { selectedRoute, routes } = useApp();

  const activeRoute = selectedRoute || routes[0];

  return (
    <div className="glass-panel rounded-3xl p-5 border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 shadow-2xl space-y-3 animate-in slide-in-from-top duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
              <span>🛡️ Safe Navigation</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold">
                ACTIVE
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={onStop}
          className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Turn-by-Turn Instruction */}
      <div className="flex items-center justify-between font-mono text-xs pt-1">
        <div>
          <span className="text-emerald-400 font-extrabold text-base block">Turn right in 300m</span>
          <span className="text-slate-400">{activeRoute?.adjustedEta || 18} min remaining</span>
        </div>

        <div className="text-right">
          <span className="text-slate-400 text-[10px] block">SAFETY SCORE</span>
          <span className="text-emerald-400 font-black text-lg">{activeRoute?.currentSafetyScore || 91}/100</span>
        </div>
      </div>

      {/* Progress Bar (Requirement #19) */}
      <div className="space-y-1">
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex items-center relative">
          <div className="w-1/3 bg-emerald-400 h-full rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
          <span>●━━━━━━━━━━━━○</span>
          <span className="font-semibold">You are on the safe route.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-3 text-xs font-bold border-t border-slate-800/80">
        <button
          onClick={onSimulateDeviation}
          className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono text-[11px] flex items-center gap-1.5 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Deviation</span>
        </button>

        <button
          onClick={onStop}
          className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          End Navigation
        </button>
      </div>
    </div>
  );
};

export default NavigationHUD;
