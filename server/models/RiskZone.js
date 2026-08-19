const mongoose = require('mongoose');

const RiskZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, default: 500 }, // in meters
  riskScore: { type: Number, required: true }, // 0 to 100
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'Elevated', 'High'], required: true },
  factors: [{ type: String }],
  historicalIncidentsCount: { type: Number, default: 0 },
  emergencyServicesNearby: {
    police: { type: Boolean, default: false },
    hospital: { type: Boolean, default: false },
    fireStation: { type: Boolean, default: false }
  },
  recommendedPrecautions: [{ type: String }]
});

module.exports = mongoose.model('RiskZone', RiskZoneSchema);
