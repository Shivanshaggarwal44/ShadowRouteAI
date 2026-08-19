const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Shivansh Sharma' },
  email: { type: String, required: true, default: 'shivansh@shadowroute.ai' },
  profileImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
  preferences: {
    safetyPriority: { type: Number, default: 80 }, // 0 to 100
    avoidHighRiskZones: { type: Boolean, default: true },
    nightNavigationMode: { type: Boolean, default: true },
    autoRerouteOnDeviation: { type: Boolean, default: true },
    locationPermission: { type: Boolean, default: true }
  },
  emergencyContacts: [
    {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, default: 'Family' },
      isPrimary: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
