import React from 'react';
import { Shield, Lock, Cpu, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060912] text-slate-400 text-xs pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-extrabold text-lg text-slate-100 font-sans tracking-tight">
                ShadowRoute <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm italic font-medium">
              “Don't Just Find the Fastest Route. Find the Safest One.”
            </p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              ShadowRoute AI is an intelligent safe navigation platform analyzing hidden urban risks, street illumination density, foot traffic patterns, and real-time emergency accessibility.
            </p>
            <p className="text-[11px] font-mono text-cyan-300/80">
              “The route you don't see might be the risk you miss.”
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="font-bold text-slate-200 font-mono text-xs uppercase tracking-wider block mb-2">Platform</span>
            <ul className="space-y-1.5 font-medium">
              <li><Link to="/routes" className="hover:text-cyan-300 transition">Safe Route Analyzer</Link></li>
              <li><Link to="/risk-map" className="hover:text-cyan-300 transition">Interactive Risk Map</Link></li>
              <li><Link to="/emergency" className="hover:text-cyan-300 transition">Emergency SOS Command</Link></li>
              <li><Link to="/profile" className="hover:text-cyan-300 transition">Safety Preferences</Link></li>
              <li><Link to="/about" className="hover:text-cyan-300 transition">AI Algorithm Model</Link></li>
            </ul>
          </div>

          {/* Security & Tech Specs */}
          <div className="space-y-2 font-mono">
            <span className="font-bold text-slate-200 text-xs uppercase tracking-wider block mb-2">Security & Tech</span>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero-Knowledge GPS</span>
              </div>
              <p className="text-[11px] text-slate-400">Location telemetry processed locally with strict encrypted anonymity.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
          <div>
            &copy; 2026 ShadowRoute AI Inc. Intelligent Safe Navigation Engine.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-cyan-400" /> React + Node + Leaflet</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
