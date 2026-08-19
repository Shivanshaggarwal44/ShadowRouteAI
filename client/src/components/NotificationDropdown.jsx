import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl p-4 shadow-2xl border border-cyan-500/20 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-100 text-sm tracking-wide">AI Safety Intel & Alerts</h3>
          <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full font-mono font-medium">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 rounded-xl border text-xs transition ${
              n.read
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                : 'bg-slate-800/50 border-cyan-500/30 text-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {getIcon(n.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-100">{n.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs">
        <button
          onClick={markAllNotificationsRead}
          className="text-cyan-400 hover:text-cyan-300 font-medium transition"
        >
          Mark all read
        </button>
        <span className="text-slate-400 font-mono text-[10px]">ShadowRoute AI Engine</span>
      </div>
    </div>
  );
};

export default NotificationDropdown;
