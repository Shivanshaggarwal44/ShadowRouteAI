import React from 'react';
import { ShieldCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react';

const ArrivalModal = ({ isOpen, onClose, routeData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5 text-center relative">
        
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg animate-bounce">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">🎉 You reached safely.</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Journey Complete</p>
        </div>

        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs text-slate-800">
          <div className="p-2 rounded-xl bg-white border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-sans">SAFETY SCORE</span>
            <span className="font-black text-emerald-600 text-base">{routeData?.currentSafetyScore || 91}/100</span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-sans">DISTANCE</span>
            <span className="font-extrabold text-slate-900">{routeData?.distanceKm || '6.8'} km</span>
          </div>

          <div className="p-2 rounded-xl bg-white border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-sans">TIME</span>
            <span className="font-extrabold text-slate-900">{routeData?.adjustedEta || 18} min</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Zero risk corridors compromised during trip.</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Done</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default ArrivalModal;
