import React from 'react';
import { AlertTriangle, RefreshCw, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DeviationAlert = ({ isOpen, onClose }) => {
  const { routeDeviation, setRouteDeviation, runRouteAnalysis, origin, destination, timeOfDay } = useApp();

  if (!isOpen && !routeDeviation) return null;

  const handleRecalculate = () => {
    setRouteDeviation(false);
    runRouteAnalysis(origin, destination, 90, timeOfDay); // Maximize safety on deviation
    if (onClose) onClose();
  };

  const handleContinue = () => {
    setRouteDeviation(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/30 space-y-4 relative text-center">
        
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/40 animate-bounce">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-100">⚠️ Route Deviation Detected</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            You moved away from your recommended safe route.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-1 font-mono">
          <span className="text-amber-400 font-bold block">ALERT ZONE TELEMETRY:</span>
          <p className="text-slate-300">Corridor safety dropped to 36/100 (Unlit shortcut section).</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 font-bold text-xs">
          <button
            onClick={handleRecalculate}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 hover:opacity-95 transition"
          >
            <RefreshCw className="w-4 h-4 fill-slate-950" />
            <span>Recalculate Safe Route</span>
          </button>
          
          <button
            onClick={handleContinue}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviationAlert;
