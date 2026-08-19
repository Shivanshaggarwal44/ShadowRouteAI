import React, { useState } from 'react';
import { MapPin, Search, Navigation, Compass, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DestinationSearch = ({ onSearch }) => {
  const { origin, destination, setDestination, setDestinationCoords, runRouteAnalysis, liveLocation, safetyPriority, timeOfDay } = useApp();
  const [inputVal, setInputVal] = useState(destination || '');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const presets = [
    { name: 'City Centre', offset: [0.015, 0.018] },
    { name: 'Railway Station', offset: [-0.02, 0.012] },
    { name: 'Hospital', offset: [0.01, -0.015] },
    { name: 'Police Station', offset: [-0.01, -0.01] },
    { name: 'College', offset: [0.025, -0.02] }
  ];

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    setIsGeocoding(true);
    setDestination(inputVal);

    try {
      // 1. Try real OpenStreetMap Nominatim Geocoding (Requirement #11)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputVal)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const targetLat = parseFloat(data[0].lat);
        const targetLng = parseFloat(data[0].lon);
        setDestinationCoords({ lat: targetLat, lng: targetLng });

        if (liveLocation.latitude && liveLocation.longitude) {
          runRouteAnalysis(origin, inputVal, safetyPriority, timeOfDay, liveLocation.latitude, liveLocation.longitude);
        }
      } else {
        // Fallback relative offset from live GPS position
        const userLat = liveLocation.latitude || 0;
        const userLng = liveLocation.longitude || 0;
        setDestinationCoords({ lat: userLat + 0.02, lng: userLng + 0.02 });
        runRouteAnalysis(origin, inputVal, safetyPriority, timeOfDay, userLat, userLng);
      }
    } catch (err) {
      console.warn('Geocoding warning, using relative destination coordinates:', err.message);
      const userLat = liveLocation.latitude || 0;
      const userLng = liveLocation.longitude || 0;
      runRouteAnalysis(origin, inputVal, safetyPriority, timeOfDay, userLat, userLng);
    } finally {
      setIsGeocoding(false);
      if (onSearch) onSearch(inputVal);
    }
  };

  const handlePresetSelect = (preset) => {
    setInputVal(preset.name);
    setDestination(preset.name);

    if (liveLocation.latitude && liveLocation.longitude) {
      const targetLat = liveLocation.latitude + preset.offset[0];
      const targetLng = liveLocation.longitude + preset.offset[1];
      setDestinationCoords({ lat: targetLat, lng: targetLng });
      runRouteAnalysis(origin, preset.name, safetyPriority, timeOfDay, liveLocation.latitude, liveLocation.longitude);
    }
    if (onSearch) onSearch(preset.name);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 border border-cyan-500/30 shadow-2xl space-y-4">
      {/* Live Origin Row */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
          <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-sans">Your Current Location</span>
          <span className="text-cyan-300 font-bold truncate block">{liveLocation.address || 'Detecting live GPS...'}</span>
        </div>
        <div className="ml-auto">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            liveLocation.isLive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {liveLocation.isLive ? 'GPS ACTIVE' : 'CONNECTING'}
          </span>
        </div>
      </div>

      {/* Destination Form (Requirement #11) */}
      <form onSubmit={handleSearchSubmit} className="space-y-3">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-emerald-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="🔎 Where do you want to go?"
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm font-medium pl-11 pr-32 py-3.5 rounded-2xl border border-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition shadow-inner"
          />
          <button
            type="submit"
            disabled={isGeocoding}
            className="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-1"
          >
            <Navigation className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isGeocoding ? 'Locating...' : 'Analyze Safe Route'}</span>
          </button>
        </div>
      </form>

      {/* Preset Destinations Row (Requirement #11) */}
      <div className="pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
        <span className="text-slate-500 text-[11px] shrink-0 font-sans">Presets:</span>
        {presets.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 shrink-0 transition"
          >
            📍 {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationSearch;
