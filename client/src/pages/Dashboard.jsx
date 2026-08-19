import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Navigation, Compass, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MapLibreView from '../components/MapLibreView';
import DestinationSearch from '../components/DestinationSearch';
import LocationDebugPanel from '../components/LocationDebugPanel';
import EmergencyButton from '../components/EmergencyButton';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, liveLocation, selectedRoute, routes, setIsNavigating } = useApp();

  const activeRoute = selectedRoute || routes[0];

  const handleStartNav = () => {
    setIsNavigating(true);
    navigate('/routes');
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* DEVELOPMENT LOCATION DEBUG PANEL (#4) */}
      <LocationDebugPanel />

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
              ShadowRoute AI Navigation
            </h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
              PROTECTED
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-0.5">
            {liveLocation.isLive ? '📍 Live GPS active. Real-time safety risk engine running.' : '📍 Detecting live browser location...'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartNav}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:opacity-95 transition"
          >
            <Navigation className="w-4 h-4 fill-slate-950" />
            <span>Launch Safe Navigation</span>
          </button>
        </div>
      </div>

      {/* DESTINATION SEARCH COMPONENT (#11 & #26) */}
      <DestinationSearch onSearch={() => navigate('/routes')} />

      {/* REAL MAP CENTERED ON ACTUAL USER (#6, #7, #9, #26) */}
      <div className="shadow-2xl rounded-3xl overflow-hidden border-2 border-cyan-500/30">
        <MapLibreView height="h-[480px]" showRiskZones={true} showAllRoutes={true} />
      </div>

      {/* RECOMMENDED SAFE ROUTE SUMMARY CARD (#26) */}
      {activeRoute && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 font-bold text-xl">
                🛡️
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                  <span>{activeRoute.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold">
                    RECOMMENDED SAFE ROUTE
                  </span>
                </h3>
                <p className="text-xs text-emerald-300 mt-0.5 font-mono">
                  3 min slower • significantly safer personal corridor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right font-mono">
                <span className="text-slate-400 text-[10px] block uppercase tracking-wider">Safety Score</span>
                <span className="text-2xl font-black text-emerald-400">{activeRoute.currentSafetyScore || 91}/100</span>
              </div>

              <button
                onClick={handleStartNav}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/25 hover:scale-105 transition flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 fill-slate-950" />
                <span>Start Safe Navigation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SOS BUTTON (#22) */}
      <EmergencyButton floating={true} />

    </div>
  );
};

export default Dashboard;
