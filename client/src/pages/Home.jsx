import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Navigation, Compass, Sparkles, ArrowRight, Lightbulb, Users, ShieldCheck, Cross } from 'lucide-react';
import MapLibreView from '../components/MapLibreView';
import SearchPanel from '../components/SearchPanel';
import EmergencyButton from '../components/EmergencyButton';
import LocationDebugPanel from '../components/LocationDebugPanel';
import { useApp } from '../context/AppContext';

const Home = () => {
  const navigate = useNavigate();
  const { liveLocation } = useApp();

  return (
    <div className="space-y-12 pb-16 font-sans text-slate-800">
      
      {/* DEV TELEMETRY PANEL */}
      <LocationDebugPanel />

      {/* HERO SECTION (#45, #46, Final Tagline) */}
      <section className="pt-4 sm:pt-8 pb-4 text-center max-w-4xl mx-auto space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>PERSONAL SAFETY NAVIGATION</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            ShadowRoute AI
          </h1>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-700">
            Don't just find the fastest route.{' '}
            <span className="text-emerald-600">
              Find the safest way there.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-1">
            AI-powered navigation that puts your safety first.
          </p>
        </div>

      </section>

      {/* MAIN LOCATION + DESTINATION SEARCH PANEL (#45) */}
      <section className="max-w-3xl mx-auto">
        <SearchPanel onSearchComplete={() => navigate('/routes')} />
      </section>

      {/* CORE LIGHT MAP PREVIEW (#5 & #28) */}
      <section className="max-w-6xl mx-auto">
        <div className="shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <MapLibreView height="h-[460px]" showRiskZones={true} showAllRoutes={true} />
        </div>
      </section>

      {/* THREE SIMPLE CORE VALUE CARDS (#18) */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto text-xl font-bold">
              💡
            </div>
            <h3 className="text-base font-bold text-slate-900">Illuminated Corridors</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prioritizes well-lit main streets and avoids unlit alleyways after dark.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto text-xl font-bold">
              🛡️
            </div>
            <h3 className="text-base font-bold text-slate-900">Explainable Safety Score</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculates transparent 0–100 safety scores comparing risk vs travel time.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto text-xl font-bold">
              📍
            </div>
            <h3 className="text-base font-bold text-slate-900">Live GPS Protection</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Continuous live GPS tracking with automatic rerouting if you deviate.
            </p>
          </div>

        </div>
      </section>

      {/* FLOATING SOS BUTTON */}
      <EmergencyButton floating={true} />

    </div>
  );
};

export default Home;
