import React from 'react';
import { Shield, Navigation, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NavigationModeHUD = ({ onStopNav, onSimulateDeviation, onSimulateArrival }) => {
  const { selectedRoute, routes } = useApp();

  const activeRoute = selectedRoute || routes[0];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-2xl space-y-4 font-sans animate-in slide-in-from-top duration-300">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <span>🛡️ Safe Journey</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold">
                ACTIVE
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={onStopNav}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Turn instruction (#22) */}
      <div className="flex items-center justify-between border-t border-b border-slate-800 py-3">
        <div>
          <span className="text-emerald-400 font-extrabold text-base block">Turn right in 300 m</span>
          <span className="text-slate-400 text-xs">{activeRoute?.adjustedEta || 18} min remaining</span>
        </div>

        <div className="text-right font-mono">
          <span className="text-slate-400 text-[10px] block">SAFETY</span>
          <span className="text-emerald-400 font-black text-lg">{activeRoute?.currentSafetyScore || 91}/100</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>You are on your safest route.</span>
      </div>

      {/* Action buttons (#24 & #25) */}
      <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-xs">
        <button
          onClick={onSimulateDeviation}
          className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 transition"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Simulate Deviation</span>
        </button>

        <button
          onClick={onSimulateArrival}
          className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center justify-center gap-1.5 transition"
        >
          <span>🎉 Simulate Arrival</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationModeHUD;
