import React from 'react';
import { Zap, Shield, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SpeedSafetySlider = () => {
  const { safetyPriority, handleSliderChange } = useApp();

  // Helper to determine active preference keyword
  const getPreferenceMode = () => {
    if (safetyPriority <= 35) return 'faster';
    if (safetyPriority >= 75) return 'safer';
    return 'balanced';
  };

  const currentMode = getPreferenceMode();

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/25 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Route Preference</h3>
        </div>
        <div className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 capitalize">
          Mode: {currentMode} ({safetyPriority}% Safety)
        </div>
      </div>

      {/* Main Preference Toggle Pills (Requirement #11) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold">
          <span className="flex items-center gap-1 text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-amber-400" /> ⚡ Faster
          </span>
          <span className="text-cyan-300">⚖️ Balanced</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="w-3.5 h-3.5 fill-emerald-400" /> 🛡️ Safer
          </span>
        </div>

        {/* Range Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="10"
            max="95"
            step="5"
            value={safetyPriority}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Preset Preference Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => handleSliderChange(20)}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
              currentMode === 'faster'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ⚡ Faster (ETA)
          </button>
          <button
            onClick={() => handleSliderChange(60)}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
              currentMode === 'balanced'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ⚖️ Balanced
          </button>
          <button
            onClick={() => handleSliderChange(90)}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
              currentMode === 'safer'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🛡️ Safer (Risk)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeedSafetySlider;
