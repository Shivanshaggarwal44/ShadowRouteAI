import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import MapLibreView from '../components/MapLibreView';
import SearchPanel from '../components/SearchPanel';
import RouteResultCard from '../components/RouteResultCard';
import NavigationModeHUD from '../components/NavigationModeHUD';
import ArrivalModal from '../components/ArrivalModal';
import DeviationAlert from '../components/DeviationAlert';
import EmergencyButton from '../components/EmergencyButton';
import LocationDebugPanel from '../components/LocationDebugPanel';
import { Sun, Moon, Clock } from 'lucide-react';

const RouteAnalysis = () => {
  const {
    origin,
    destination,
    routes,
    selectedRoute,
    setSelectedRoute,
    timeOfDay,
    handleTimeChange,
    isNavigating,
    setIsNavigating,
    routeDeviation,
    setRouteDeviation
  } = useApp();

  const [arrivalModalOpen, setArrivalModalOpen] = useState(false);

  const activeRoute = selectedRoute || routes[0];

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
    setRouteDeviation(false);
  };

  const handleSimulateArrival = () => {
    setIsNavigating(false);
    setArrivalModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-800">
      
      {/* DEV TELEMETRY PANEL */}
      <LocationDebugPanel />

      {/* HEADER & TIME SELECTOR (#18) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              SAFE JOURNEY ANALYZER
            </span>
            <span className="text-xs text-slate-500 font-medium">| {origin} → {destination}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Choose your safest route
          </h1>
        </div>

        {/* TIME-OF-DAY SAFETY MULTIPLIER (#18) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-medium">
          <span className="text-slate-500 px-2 hidden sm:inline">Time of Day:</span>
          <button
            onClick={() => handleTimeChange('daytime')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              timeOfDay === 'daytime'
                ? 'bg-amber-500 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Day (89)</span>
          </button>
          <button
            onClick={() => handleTimeChange('evening')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              timeOfDay === 'evening'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Evening (74)</span>
          </button>
          <button
            onClick={() => handleTimeChange('late_night')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              timeOfDay === 'late_night'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Night (55)</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION ACTIVE HUD (#22 & #23) */}
      {isNavigating && (
        <NavigationModeHUD
          onStopNav={handleStopNavigation}
          onSimulateDeviation={() => setRouteDeviation(true)}
          onSimulateArrival={handleSimulateArrival}
        />
      )}

      {/* DUAL COLUMN LAYOUT: SEARCH & RESULT (LEFT) / MAP (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SEARCH & ROUTE RESULT CARD */}
        <div className="lg:col-span-5 space-y-6">
          <SearchPanel />
          <RouteResultCard onStartJourney={handleStartNavigation} />
        </div>

        {/* RIGHT COLUMN: LIGHT LEAFLET MAP (#5 & #28) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="shadow-xl rounded-2xl overflow-hidden border border-slate-200">
            <MapLibreView
              height="h-[600px]"
              showRiskZones={true}
              showAllRoutes={true}
              onSelectRoute={(r) => setSelectedRoute(r)}
            />
          </div>
        </div>

      </div>

      {/* ROUTE DEVIATION ALERT MODAL (#24) */}
      <DeviationAlert isOpen={routeDeviation} onClose={() => setRouteDeviation(false)} />

      {/* ARRIVAL MODAL (#25) */}
      <ArrivalModal
        isOpen={arrivalModalOpen}
        onClose={() => setArrivalModalOpen(false)}
        routeData={activeRoute}
      />

      {/* FLOATING SOS BUTTON (#26) */}
      <EmergencyButton floating={true} />

    </div>
  );
};

export default RouteAnalysis;
