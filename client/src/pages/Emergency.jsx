import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, AlertOctagon, PhoneCall, ShieldAlert, Navigation, MapPin, CheckCircle2, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MapLibreView from '../components/MapLibreView';
import EmergencyButton from '../components/EmergencyButton';
import { getEmergencyServicesAPI } from '../services/api';

const Emergency = () => {
  const navigate = useNavigate();
  const { sosActive, sosData, cancelSOS, user, setDestination, runRouteAnalysis, origin, liveLocation } = useApp();
  const [services, setServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const params = liveLocation.isLive ? { userLat: liveLocation.latitude, userLng: liveLocation.longitude } : {};
        const res = await getEmergencyServicesAPI(params);
        if (res && res.success) setServices(res.services);
      } catch (err) {
        console.warn('Emergency services fetch warning:', err.message);
      }
    };
    fetchServices();
  }, [liveLocation.isLive, liveLocation.latitude, liveLocation.longitude]);

  const handleNavigateToService = (service) => {
    setDestination(service.name);
    runRouteAnalysis(origin, service.name, 90, 'evening'); // Max safety route to hospital/police
    navigate('/routes');
  };

  const filteredServices = services.filter(s => activeFilter === 'ALL' || s.type.toUpperCase() === activeFilter);

  return (
    <div className="space-y-8 pb-12">
      
      {/* PAGE HEADER */}
      <div className="glass-panel rounded-2xl p-5 border border-red-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white bg-red-600 px-2.5 py-0.5 rounded font-extrabold shadow-sm animate-pulse">
              24/7 COMMAND
            </span>
            <span className="text-xs text-slate-400 font-mono">| EMERGENCY SOS & REFUGE NETWORK</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
            Emergency Assistance & Safe Haven Finder
          </h1>
        </div>

        <EmergencyButton size="normal" />
      </div>

      {/* ACTIVE EMERGENCY MODE DISPLAY BARS (#14) */}
      {sosActive && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-red-500 bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 shadow-2xl shadow-red-500/30 space-y-6 animate-in zoom-in duration-300">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-red-500/30 pb-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-400 animate-bounce">
                <Radio className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-xl font-extrabold text-white">EMERGENCY MODE ACTIVATED</h2>
                  <span className="bg-red-500 text-white font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                    LIVE BROADCAST
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  High-priority telemetry transmitting location to emergency contacts & police precinct.
                </p>
              </div>
            </div>

            <button
              onClick={cancelSOS}
              className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
            >
              Cancel Emergency Mode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5 font-bold">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>BROADCASTING POSITION</span>
              </div>
              <p className="font-bold text-slate-100 text-sm">
                {liveLocation.latitude ? `${liveLocation.latitude.toFixed(4)}° N, ${liveLocation.longitude.toFixed(4)}° E` : 'Live Position Broadcast Active'}
              </p>
              <p className="text-[11px] text-slate-400">{origin || 'Current Location'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5 font-bold">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>CONTACTS NOTIFIED</span>
              </div>
              <p className="font-bold text-emerald-300 text-sm">2 Emergency SMS Sent</p>
              <p className="text-[11px] text-slate-400">Aarav Sharma & Priya Sharma</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5 font-bold">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>CLOSEST POLICE DISPATCH</span>
              </div>
              <p className="font-bold text-slate-100 text-sm">HQ Precinct #4 (600m)</p>
              <p className="text-[11px] text-cyan-300 font-bold">ETA: 2 Mins Response</p>
            </div>

          </div>
        </div>
      )}

      {/* CENTRAL SOS BUTTON STANDALONE LANDING HERO */}
      {!sosActive && (
        <div className="glass-panel rounded-3xl p-8 border border-red-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100">
              One-Tap Panic & Emergency System
            </h2>
            <p className="text-xs text-slate-300">
              Press the SOS button below if you feel unsafe or require immediate assistance.
            </p>
          </div>

          <div className="py-4">
            <EmergencyButton size="large" />
          </div>
        </div>
      )}

      {/* NEARBY EMERGENCY SERVICES NETWORK (#15) */}
      <div className="space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Nearby Verified Emergency Facilities</h2>
            <p className="text-xs text-slate-400">Police stations, level-1 trauma hospitals, and fire depots within 2km.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {['ALL', 'POLICE', 'HOSPITAL', 'FIRE STATION'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  activeFilter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Services Map & Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 shadow-2xl rounded-3xl overflow-hidden border border-cyan-500/30">
            <MapLibreView
              height="h-[500px]"
              showEmergencyServices={true}
              emergencyServicesData={filteredServices}
            />
          </div>

          <div className="lg:col-span-5 space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{s.name}</h4>
                      <p className="text-xs text-slate-400">{s.address}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 font-mono font-bold text-xs shrink-0 border border-cyan-500/30">
                    {s.distanceKm} km ({s.etaMinutes} min)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 font-mono text-[11px]">{s.status}</span>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${s.phone}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
                    >
                      Call
                    </a>
                    
                    <button
                      onClick={() => handleNavigateToService(s)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold flex items-center gap-1 shadow-md shadow-emerald-500/20 hover:opacity-95 transition"
                    >
                      <Navigation className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Navigate Here</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Emergency;
