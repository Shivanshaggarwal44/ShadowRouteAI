import React from 'react';
import { Layers, CheckCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const RouteComparison = () => {
  const { routes } = useApp();

  if (!routes || routes.length === 0) return null;

  // Map routes by type or fallback
  const safeRoute = routes.find(r => r.type === 'SAFE') || routes[0];
  const fastRoute = routes.find(r => r.type === 'FAST') || routes[1] || routes[0];
  const balancedRoute = routes.find(r => r.type === 'BALANCED') || routes[2] || routes[0];

  const comparisonRows = [
    {
      factor: 'Travel Time (ETA)',
      routeA: `${fastRoute?.adjustedEta || 15} mins ⚡`,
      routeB: `${safeRoute?.adjustedEta || 18} mins (Recommended)`,
      routeC: `${balancedRoute?.adjustedEta || 20} mins`
    },
    {
      factor: 'Distance',
      routeA: `${fastRoute?.distanceKm || 6.2} km`,
      routeB: `${safeRoute?.distanceKm || 6.8} km`,
      routeC: `${balancedRoute?.distanceKm || 7.1} km`
    },
    {
      factor: 'AI Safety Score',
      routeA: `${fastRoute?.currentSafetyScore || 42}/100 🔴`,
      routeB: `${safeRoute?.currentSafetyScore || 89}/100 🟢`,
      routeC: `${balancedRoute?.currentSafetyScore || 67}/100 🟡`
    },
    {
      factor: 'Street Illumination',
      routeA: 'Low (30% Lights Out)',
      routeB: 'High (100% LED Active)',
      routeC: 'Medium (Flyover Lights)'
    },
    {
      factor: 'Pedestrian Crowd Density',
      routeA: 'Low (Isolated Lanes)',
      routeB: 'High (Active Shops)',
      routeC: 'Medium (Vehicular Flow)'
    },
    {
      factor: 'Historical Incident Rate',
      routeA: 'High (3 in 30 days)',
      routeB: 'Zero (Past 90 days)',
      routeC: 'Low (1 hazard reported)'
    },
    {
      factor: 'Police Station Proximity',
      routeA: '1.8 km away',
      routeB: 'Within 400m',
      routeC: '1.2 km away'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Route Safety Matrix Comparison</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">SIDE-BY-SIDE ANALYTICS</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">Evaluation Factor</th>
              <th className="py-3 px-3 bg-red-500/10 text-red-300 rounded-t-lg">
                Route A ({fastRoute?.name?.split(' ')[0] || 'Shortcut'})
              </th>
              <th className="py-3 px-3 bg-emerald-500/15 text-emerald-300 rounded-t-lg font-extrabold border-t border-x border-emerald-500/30">
                🛡️ Route B (Recommended Safe)
              </th>
              <th className="py-3 px-3 bg-amber-500/10 text-amber-300 rounded-t-lg">
                Route C ({balancedRoute?.name?.split(' ')[0] || 'Ring Road'})
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition">
                <td className="py-3 px-3 font-semibold text-slate-300">{row.factor}</td>
                <td className="py-3 px-3 text-slate-400 bg-red-500/5">{row.routeA}</td>
                <td className="py-3 px-3 font-bold text-slate-100 bg-emerald-500/10 border-x border-emerald-500/20">
                  {row.routeB}
                </td>
                <td className="py-3 px-3 text-slate-400 bg-amber-500/5">{row.routeC}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteComparison;
