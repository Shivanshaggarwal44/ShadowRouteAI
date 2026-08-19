import React, { useState, useEffect } from 'react';
import { checkHealthAPI } from '../services/api';
import { Radio, Wifi, WifiOff, Sparkles } from 'lucide-react';

const BackendStatusIndicator = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await checkHealthAPI();
        if (res && res.status === 'ok') {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-[11px]">
      {isConnected ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <Wifi className="w-3.5 h-3.5" />
          <span>Backend Connected</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Demo Fallback Mode</span>
        </span>
      )}
    </div>
  );
};

export default BackendStatusIndicator;
