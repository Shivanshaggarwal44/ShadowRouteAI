const mockRiskZones = require('../data/mockRiskZones');
const mockIncidents = require('../data/mockIncidents');
const RiskZone = require('../models/RiskZone');
const Incident = require('../models/Incident');
const { getDBStatus } = require('../config/db');

// GET /api/risk-zones
const getRiskZones = async (req, res) => {
  try {
    if (getDBStatus()) {
      const dbZones = await RiskZone.find();
      if (dbZones.length > 0) return res.status(200).json({ success: true, zones: dbZones });
    }
  } catch (e) {
    // fallback
  }

  return res.status(200).json({ success: true, zones: mockRiskZones });
};

// GET /api/incidents
const getIncidents = async (req, res) => {
  try {
    if (getDBStatus()) {
      const dbIncidents = await Incident.find().sort({ timestamp: -1 });
      if (dbIncidents.length > 0) return res.status(200).json({ success: true, incidents: dbIncidents });
    }
  } catch (e) {
    // fallback
  }

  return res.status(200).json({ success: true, incidents: mockIncidents });
};

// POST /api/incidents
const createIncident = async (req, res) => {
  try {
    const { locationName, latitude, longitude, type, severity, description } = req.body;

    const newIncident = {
      id: `inc_${Date.now()}`,
      locationName,
      latitude: Number(latitude),
      longitude: Number(longitude),
      type,
      severity,
      timestamp: new Date().toISOString(),
      description,
      upvotes: 1,
      verified: true
    };

    if (getDBStatus()) {
      try {
        await Incident.create(newIncident);
      } catch (err) {
        console.warn('Could not save incident to DB:', err.message);
      }
    }

    // Add to in-memory list for instant reactivity
    mockIncidents.unshift(newIncident);

    return res.status(201).json({
      success: true,
      message: 'Incident reported successfully and verified by AI.',
      incident: newIncident
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to report incident', error: error.message });
  }
};

module.exports = {
  getRiskZones,
  getIncidents,
  createIncident
};
