const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  locationName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  type: { type: String, enum: ['Harassment', 'Poor Lighting', 'Road Block', 'Suspicious Activity', 'Accident', 'Lack of Patrol'], required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  timestamp: { type: Date, default: Date.now },
  description: { type: String, required: true },
  upvotes: { type: Number, default: 1 },
  verified: { type: Boolean, default: true }
});

module.exports = mongoose.model('Incident', IncidentSchema);
