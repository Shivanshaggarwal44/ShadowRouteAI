import React, { useState } from 'react';
import { MapPin, Search, Navigation, Compass, ArrowDown, Home, Briefcase, GraduationCap, Hospital, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SearchPanel = ({ onSearchComplete }) => {
  const { origin, destination, setDestination, setDestinationCoords, runRouteAnalysis, liveLocation, safetyPriority, timeOfDay } = useApp();
  
  const [originInput, setOriginInput] = useState('Your current location');
  const [destinationInput, setDestinationInput] = useState(destination || '');
  const [isSearching, setIsSearching] = useState(false);

  const quickPlaces = [
    { label: 'Home', icon: Home, offset: [0.012, 0.015] },
    { label: 'Work', icon: Briefcase, offset: [-0.018, 0.01] },
    { label: 'College', icon: GraduationCap, offset: [0.022, -0.018] },
    { label: 'Hospital', icon: Hospital, offset: [0.008, -0.012] },
    { label: 'Police Station', icon: Shield, offset: [-0.01, -0.01] }
  ];

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!destinationInput.trim()) return;

    setIsSearching(true);
    setDestination(destinationInput);

    try {
      // OpenStreetMap Nominatim Geocoding
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationInput)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        const targetLat = parseFloat(data[0].lat);
        const targetLng = parseFloat(data[0].lon);
        setDestinationCoords({ lat: targetLat, lng: targetLng });

        if (liveLocation.latitude && liveLocation.longitude) {
          runRouteAnalysis(origin, destinationInput, safetyPriority, timeOfDay, liveLocation.latitude, liveLocation.longitude);
        }
      } else {
        const userLat = liveLocation.latitude || 0;
        const userLng = liveLocation.longitude || 0;
        setDestinationCoords({ lat: userLat + 0.015, lng: userLng + 0.015 });
        runRouteAnalysis(origin, destinationInput, safetyPriority, timeOfDay, userLat, userLng);
      }
    } catch (err) {
      console.warn('Geocoding warning, using relative destination coordinates:', err.message);
      const userLat = liveLocation.latitude || 0;
      const userLng = liveLocation.longitude || 0;
      runRouteAnalysis(origin, destinationInput, safetyPriority, timeOfDay, userLat, userLng);
    } finally {
      setIsSearching(false);
      if (onSearchComplete) onSearchComplete(destinationInput);
    }
  };

  const handleQuickPlaceClick = (place) => {
    setDestinationInput(place.label);
    setDestination(place.label);

    if (liveLocation.latitude && liveLocation.longitude) {
      const targetLat = liveLocation.latitude + place.offset[0];
      const targetLng = liveLocation.longitude + place.offset[1];
      setDestinationCoords({ lat: targetLat, lng: targetLng });
      runRouteAnalysis(origin, place.label, safetyPriority, timeOfDay, liveLocation.latitude, liveLocation.longitude);
    }

    if (onSearchComplete) onSearchComplete(place.label);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-xl space-y-4 font-sans text-slate-800">
      
      <div className="space-y-3">
        {/* Step 1: Starting point */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Step 1: Starting Point
          </label>
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="overflow-hidden flex-1">
              <span className="font-bold text-slate-800 block truncate">
                {liveLocation.isLive ? 'Your current location' : 'Detecting GPS...'}
              </span>
              <span className="text-[11px] text-slate-500 block truncate">{liveLocation.address}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              LIVE
            </span>
          </div>
        </div>

        {/* Down Arrow connector */}
        <div className="flex justify-center text-slate-400 py-0.5">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Step 2: Destination */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Step 2: Where are you going?
          </label>
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              placeholder="Search destination (e.g. Railway Station, Hospital...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-28 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition active:scale-95 flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>{isSearching ? 'Searching...' : 'Find Route'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Step 3: Quick Places */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Quick Destinations:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {quickPlaces.map((place) => {
            const Icon = place.icon;
            return (
              <button
                key={place.label}
                type="button"
                onClick={() => handleQuickPlaceClick(place)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-semibold shrink-0 transition"
              >
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span>{place.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
