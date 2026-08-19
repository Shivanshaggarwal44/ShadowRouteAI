import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState({
    coords: null,
    address: 'Detecting live GPS location...',
    status: 'detecting', // 'detecting' | 'enabled' | 'error'
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        status: 'error',
        error: 'Geolocation is not supported by your browser.'
      }));
      return;
    }

    // 1. Initial position fetch
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({
          coords: { lat, lng },
          address: `You Are Here (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          status: 'enabled',
          error: null
        });
      },
      (err) => {
        setLocation(prev => ({
          ...prev,
          status: 'error',
          error: 'Location permission is required for live navigation.'
        }));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    // 2. Watcher for continuous updates
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation(prev => ({
          ...prev,
          coords: { lat, lng },
          address: `You Are Here (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          status: 'enabled'
        }));
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    // Cleanup watcher on unmount
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
};
