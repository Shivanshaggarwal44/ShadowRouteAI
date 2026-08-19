const mockEmergencyServices = require('../data/mockEmergencyServices');
const EmergencyEvent = require('../models/EmergencyEvent');
const { getDBStatus } = require('../config/db');

// Helper to calculate approximate distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// GET /api/emergency-services
const getEmergencyServices = async (req, res) => {
  const { userLat, userLng } = req.query;

  let services = [...mockEmergencyServices];

  if (userLat && userLng) {
    const lat = Number(userLat);
    const lng = Number(userLng);

    services = services.map(service => {
      const dist = calculateDistanceKm(lat, lng, service.latitude, service.longitude);
      const eta = Math.max(1, Math.round(dist * 3)); // ~3 mins per km
      return {
        ...service,
        distanceKm: dist,
        etaMinutes: eta
      };
    });

    services.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return res.status(200).json({
    success: true,
    services
  });
};

// POST /api/emergency/sos
const triggerSOS = async (req, res) => {
  try {
    const { latitude = 28.6230, longitude = 77.2180, address = 'Central Plaza Junction', activeRouteId = 'route_b_safe' } = req.body;

    const sosPayload = {
      id: `sos_${Date.now()}`,
      userId: 'shivansh_01',
      location: { latitude: Number(latitude), longitude: Number(longitude), address },
      timestamp: new Date().toISOString(),
      status: 'TRIGGERED',
      contactsNotifiedCount: 2,
      activeRouteId
    };

    if (getDBStatus()) {
      try {
        await EmergencyEvent.create(sosPayload);
      } catch (e) {
        console.warn('Could not record SOS in DB:', e.message);
      }
    }

    // Nearby police & hospital recommendation relative to user position
    let services = mockEmergencyServices.map(s => {
      const dist = calculateDistanceKm(Number(latitude), Number(longitude), s.latitude, s.longitude);
      return { ...s, distanceKm: dist, etaMinutes: Math.max(1, Math.round(dist * 3)) };
    });

    services.sort((a, b) => a.distanceKm - b.distanceKm);

    const closestPolice = services.find(s => s.type === 'Police') || services[0];
    const closestHospital = services.find(s => s.type === 'Hospital') || services[1];

    return res.status(200).json({
      success: true,
      message: '🚨 Emergency Assistance Mode Activated. Live location broadcasting.',
      sosEvent: sosPayload,
      nearestPolice: closestPolice,
      nearestHospital: closestHospital,
      emergencyNotice: 'Simulated Emergency Protocol: SMS alerts transmitted to 2 designated emergency contacts. Police precinct notified.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to dispatch SOS', error: error.message });
  }
};

module.exports = {
  getEmergencyServices,
  triggerSOS
};
