import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LocationDebugPanel = () => {
  const { liveLocation } = useApp();
  const [isOpen, setIsOpen] = useState(true);

  if (!liveLocation) return null;

  return (
    <div className="glass-panel rounded-2xl border border-cyan-500/30 overflow-hidden shadow-xl text-xs font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-cyan-300">DEV TELEMETRY: REAL GPS MONITOR</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            liveLocation.isLive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}>
            {liveLocation.isLive ? 'ACTIVE GPS' : liveLocation.loading ? 'DETECTING' : 'OFFLINE'}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 bg-slate-950/90 text-slate-300 space-y-2">
          {liveLocation.error ? (
            <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">GPS Error ({liveLocation.errorType}):</p>
                <p className="text-[11px] font-mono text-red-200">{liveLocation.error}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">STATUS</span>
                <span className="font-bold text-emerald-400">{liveLocation.isLive ? 'Live GPS Connected' : 'Detecting...'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">LATITUDE</span>
                <span className="font-bold text-cyan-300">{liveLocation.latitude ? liveLocation.latitude.toFixed(6) : 'N/A'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">LONGITUDE</span>
                <span className="font-bold text-cyan-300">{liveLocation.longitude ? liveLocation.longitude.toFixed(6) : 'N/A'}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block font-sans">ACCURACY</span>
                <span className="font-bold text-emerald-400">{liveLocation.accuracy ? `${liveLocation.accuracy} meters` : 'N/A'}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800/80 font-sans">
            <span>Address: <strong className="text-slate-200 font-mono">{liveLocation.address}</strong></span>
            <button
              onClick={liveLocation.refreshLocation}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[10px] bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30"
            >
              <RefreshCw className="w-3 h-3" /> Refresh GPS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDebugPanel;
