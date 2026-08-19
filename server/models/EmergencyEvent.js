const mongoose = require('mongoose');

const EmergencyEventSchema = new mongoose.Schema({
  userId: { type: String, default: 'shivansh_01' },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: 'Central Plaza Junction' }
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['TRIGGERED', 'DISPATCHED', 'RESOLVED', 'CANCELLED'], default: 'TRIGGERED' },
  contactsNotifiedCount: { type: Number, default: 2 },
  activeRouteId: { type: String }
});

module.exports = mongoose.model('EmergencyEvent', EmergencyEventSchema);
