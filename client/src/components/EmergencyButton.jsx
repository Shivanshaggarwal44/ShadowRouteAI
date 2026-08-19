import React, { useState } from 'react';
import { Radio, AlertOctagon, PhoneCall, ShieldAlert, MapPin, CheckCircle2, X, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const EmergencyButton = ({ size = 'normal', floating = false }) => {
  const { triggerSOS, sosActive, userLocation, origin } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShareLocation = () => {
    setShared(true);
    triggerSOS();
    setTimeout(() => setShared(false), 3000);
  };

  const handleCallEmergency = () => {
    triggerSOS();
    window.location.href = 'tel:911';
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`font-mono font-extrabold tracking-wider transition-all duration-300 active:scale-95 shadow-2xl ${
          floating
            ? 'fixed bottom-6 right-6 z-50 p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-red-600/50 border-2 border-red-400 animate-pulse'
            : sosActive
            ? 'bg-red-600 text-white animate-pulse shadow-red-500/80 ring-4 ring-red-500/50 px-4 py-2.5 rounded-2xl text-xs'
            : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white hover:from-red-500 hover:to-rose-500 shadow-red-600/40 border border-red-500/50 px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2'
        }`}
      >
        <span className="relative flex h-3 w-3 inline-block">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <span>🚨 SOS</span>
      </button>

      {/* Emergency Assistance Modal (Requirement #16) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border-2 border-red-500/60 shadow-2xl shadow-red-500/40 text-center space-y-4 relative">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/30">
              <AlertOctagon className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-100">Emergency Assistance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Rapid Safety Dispatch Network</p>
            </div>

            <div className="space-y-2.5 text-xs text-left font-mono">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT LOCATION</span>
                  <span className="text-slate-200 font-bold">{origin || 'Financial Hub Plaza'}</span>
                </div>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Detected
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">NEARBY POLICE</span>
                  <span className="text-slate-200 font-bold">Central Precinct #4</span>
                </div>
                <span className="text-cyan-400 font-bold">1.2 km (2m ETA)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">NEARBY HOSPITAL</span>
                  <span className="text-slate-200 font-bold">Metropolitan General</span>
                </div>
                <span className="text-cyan-400 font-bold">2.4 km (4m ETA)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[10px]">EMERGENCY CONTACTS</span>
                  <span className="text-slate-200 font-bold">2 Contacts Ready</span>
                </div>
                <span className="text-emerald-400 font-bold">Available</span>
              </div>
            </div>

            {shared && (
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                ✓ Live location broadcasted to contacts!
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleShareLocation}
                className="py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Location</span>
              </button>

              <button
                onClick={handleCallEmergency}
                className="py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/40 transition flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Emergency</span>
              </button>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyButton;
