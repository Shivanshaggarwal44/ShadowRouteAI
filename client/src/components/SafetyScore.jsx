import React from 'react';
import { Shield, ShieldAlert, CheckCircle2, Moon, Sun, Clock, Eye, AlertOctagon } from 'lucide-react';

const SafetyScore = ({ score = 89, riskLevel = 'Low', factorsBreakdown = {}, timeOfDay = 'evening' }) => {
  
  // Color configuration
  const getColor = (s) => {
    if (s >= 85) return { stroke: '#10B981', text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    if (s >= 70) return { stroke: '#06B6D4', text: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' };
    if (s >= 50) return { stroke: '#F59E0B', text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
    return { stroke: '#EF4444', text: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const theme = getColor(score);

  // SVG Circle calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const factors = [
    { label: 'Street Illumination', value: factorsBreakdown.lighting || 92, icon: '💡' },
    { label: 'Crowd & Pedestrian Density', value: factorsBreakdown.crowdDensity || 88, icon: '👥' },
    { label: 'Incident Density (Low = High Score)', value: factorsBreakdown.incidentHistory || 95, icon: '🛡️' },
    { label: 'Emergency Response Proximity', value: factorsBreakdown.emergencyProximity || 90, icon: '🚔' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>AI Safety Score</span>
          </h3>
          <p className="text-xs text-slate-400">Multi-Factor Real-time Risk Assessment</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${theme.bg} ${theme.text} ${theme.border} border`}>
          {riskLevel} Risk
        </span>
      </div>

      <div className="flex items-center gap-6 py-2">
        {/* SVG Circular Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-3xl font-extrabold font-mono tracking-tight ${theme.text}`}>
              {score}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
          </div>
        </div>

        {/* Dynamic Class Description */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            {score >= 75 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : score >= 50 ? (
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>
              {score >= 90
                ? 'Very Safe Route'
                : score >= 75
                ? 'Safe Recommended Corridor'
                : score >= 50
                ? 'Moderate Caution Advised'
                : 'High Risk - Rerouting Recommended'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {score >= 75
              ? 'High illumination levels, active police coverage, and zero recent incident markers detected.'
              : 'Isolated sections or lower crowd volume detected. Avoid unlit shortcuts.'}
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time setting: <strong className="text-slate-200 uppercase">{timeOfDay.replace('_', ' ')}</strong></span>
          </div>
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
        <span className="text-xs font-semibold text-slate-300 block">Sub-Factor Risk Ratings</span>
        {factors.map((f, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </span>
              <span className="font-bold text-slate-200">{f.value}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  f.value >= 80 ? 'bg-emerald-400' : f.value >= 60 ? 'bg-cyan-400' : 'bg-amber-400'
                }`}
                style={{ width: `${f.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyScore;
