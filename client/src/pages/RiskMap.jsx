import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, ShieldAlert, Plus, MapPin, Eye, PhoneCall, CheckCircle2, Filter } from 'lucide-react';
import MapLibreView from '../components/MapLibreView';
import IncidentReportModal from '../components/IncidentReportModal';
import { getRiskZonesAPI, getIncidentsAPI } from '../services/api';

const RiskMap = () => {
  const [riskZones, setRiskZones] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zoneRes, incRes] = await Promise.all([getRiskZonesAPI(), getIncidentsAPI()]);
        if (zoneRes.success) {
          setRiskZones(zoneRes.zones);
          setSelectedZone(zoneRes.zones[0]);
        }
        if (incRes.success) {
          setIncidents(incRes.incidents);
        }
      } catch (err) {
        console.warn('Risk map data fetch warning:', err.message);
      }
    };
    fetchData();
  }, []);

  const filteredZones = riskZones.filter(z => filterLevel === 'ALL' || z.riskLevel.toUpperCase() === filterLevel);

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER BAR */}
      <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-red-400 uppercase bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/30">
              URBAN RISK REGISTRY
            </span>
            <span className="text-xs text-slate-400 font-mono">| REAL-TIME HAZARD & INCIDENT MAP</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
            Dedicated Urban Risk & Safety Zone Inspector
          </h1>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:opacity-95 transition"
        >
          <Plus className="w-4 h-4 fill-slate-950" />
          <span>Report Safety Incident</span>
        </button>
      </div>

      {/* DUAL COLUMN: MAP (LEFT) & ZONE INSPECTOR (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MAP COLUMN */}
        <div className="lg:col-span-8 space-y-4">
          <div className="shadow-2xl rounded-3xl overflow-hidden border border-cyan-500/30">
            <MapLibreView
              height="h-[560px]"
              showRiskZones={true}
              riskZonesData={riskZones}
            />
          </div>

          {/* RISK LEVEL FILTER PILLS */}
          <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-300">Filter Zones:</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              {['ALL', 'HIGH', 'MODERATE', 'ELEVATED', 'LOW'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                    filterLevel === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ZONE INSPECTOR COLUMN (#10) */}
        <div className="lg:col-span-4 space-y-6">
          
          {selectedZone ? (
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 shadow-2xl space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">ZONE INSPECTOR</span>
                  <h3 className="text-lg font-bold text-slate-100 mt-0.5">{selectedZone.name}</h3>
                </div>

                <div className={`px-3 py-1 rounded-xl text-xs font-mono font-extrabold border ${
                  selectedZone.riskScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                  selectedZone.riskScore >= 60 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  {selectedZone.riskLevel} Risk ({selectedZone.riskScore}/100)
                </div>
              </div>

              {/* Factors Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-300 block">Main Risk Factors:</span>
                <div className="space-y-1.5">
                  {selectedZone.factors?.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Incidents & Emergency Access */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">INCIDENTS FILED</span>
                  <span className="font-bold text-slate-100 text-sm">{selectedZone.historicalIncidentsCount} Recent Reports</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">POLICE POST</span>
                  <span className={`font-bold text-sm ${selectedZone.emergencyServicesNearby?.police ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedZone.emergencyServicesNearby?.police ? 'Active Nearby' : 'None within 1km'}
                  </span>
                </div>
              </div>

              {/* Recommended Precautions */}
              {selectedZone.recommendedPrecautions && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <span className="text-xs font-mono font-semibold text-emerald-400 block">Recommended Precautions:</span>
                  {selectedZone.recommendedPrecautions.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-xs">
              Select a zone on the map to inspect safety metrics.
            </div>
          )}

          {/* ZONE LIST SELECTOR */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-100 text-sm">Registered Risk Zones</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredZones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedZone?.id === z.id
                      ? 'bg-slate-800 border-cyan-500/50 text-slate-100'
                      : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{z.name}</span>
                    <span style={{ color: z.color }}>{z.riskLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* REPORT MODAL */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={(newInc) => setIncidents(prev => [newInc, ...prev])}
      />

    </div>
  );
};

export default RiskMap;
