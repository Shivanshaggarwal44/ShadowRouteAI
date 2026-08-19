import React from 'react';
import { Shield, Cpu, Lock, Sliders, CheckCircle2, ArrowRight, Layers, Eye, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <div className="text-center space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>SHADOWROUTE AI ALGORITHM MODEL</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          How ShadowRoute AI Works
        </h1>

        <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
          “Don't Just Find the Fastest Route. Find the Safest One.”
        </p>

        <p className="text-xs font-mono text-cyan-300/80">
          “The route you don't see might be the risk you miss.”
        </p>
      </div>

      {/* COMPARISON CHART: TRADITIONAL VS SHADOWROUTE AI */}
      <div className="glass-panel rounded-3xl p-8 border border-cyan-500/30 shadow-2xl space-y-6">
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Traditional Navigation vs. ShadowRoute AI</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-red-300">
              <AlertOctagon className="w-4 h-4" />
              <span>Traditional Navigation Systems</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✗</span>
                <span>Optimizes exclusively for shortest distance and lowest travel time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✗</span>
                <span>Directs commuters into unlit alleyways, deserted shortcuts, and underpasses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✗</span>
                <span>Ignores historical harassment, crime reports, and streetlamp outage data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✗</span>
                <span>Provides no emergency fallback or automatic deviation warnings.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
              <Shield className="w-4 h-4" />
              <span>ShadowRoute AI Intelligence</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Calculates multi-dimensional Safety Score (0-100) per route.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Prioritizes well-lit avenues, active commercial areas, and police stations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Dynamically reranks options based on your Speed vs. Safety slider preference.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Provides Smart Off-Route Deviation warnings and 1-tap SOS emergency broadcast.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* THE 7 FACTOR MATHEMATICAL MODEL */}
      <div className="glass-panel rounded-3xl p-8 border border-cyan-500/30 shadow-2xl space-y-6">
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>The Multi-Factor Risk Calculation Engine</span>
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          ShadowRoute AI combines seven core telemetry variables into a unified Safety Score:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">1. Street Illumination (20%)</span>
            <p className="text-slate-400 text-[11px]">Streetlamp density & night visibility index.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">2. Pedestrian Crowd Density (20%)</span>
            <p className="text-slate-400 text-[11px]">Active open commercial shops & foot traffic.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">3. Incident History (25%)</span>
            <p className="text-slate-400 text-[11px]">Inverse crime density along 500m route buffer.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">4. Emergency Accessibility (15%)</span>
            <p className="text-slate-400 text-[11px]">Proximity to Police Precincts & Level-1 Hospitals.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">5. Time of Day Multiplier (10%)</span>
            <p className="text-slate-400 text-[11px]">Daytime (1.0x), Evening (0.85x), Late Night (0.65x).</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">6. Road & Infrastructure (10%)</span>
            <p className="text-slate-400 text-[11px]">Construction hazards & narrow walkway penalties.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pt-4">
        <p className="text-sm font-semibold text-slate-200">
          ShadowRoute AI — Intelligent navigation built around your safety.
        </p>
        <button
          onClick={() => navigate('/routes')}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 hover:opacity-95 transition"
        >
          Explore Safe Routes Now
        </button>
      </div>

    </div>
  );
};

export default About;
