const mongoose = require('mongoose');

const RouteAnalysisSchema = new mongoose.Schema({
  userId: { type: String, default: 'shivansh_01' },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distance: { type: String, required: true },
  duration: { type: String, required: true },
  safetyScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['Very Safe', 'Safe', 'Moderate', 'High Risk', 'Very High Risk'], required: true },
  riskFactors: [{ type: String }],
  preferenceRatio: { type: Number, default: 75 }, // Safety %
  timeOfDay: { type: String, default: 'evening' },
  selectedRouteId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RouteAnalysis', RouteAnalysisSchema);
