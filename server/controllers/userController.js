const User = require('../models/User');
const { getDBStatus } = require('../config/db');

// Mock in-memory fallback user
let inMemoryUser = {
  id: 'shivansh_01',
  name: 'Shivansh Sharma',
  email: 'shivansh@shadowroute.ai',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  preferences: {
    safetyPriority: 80,
    avoidHighRiskZones: true,
    nightNavigationMode: true,
    autoRerouteOnDeviation: true,
    locationPermission: true
  },
  emergencyContacts: [
    { id: 'c1', name: 'Aarav Sharma', phone: '+1 (555) 234-5678', relation: 'Brother', isPrimary: true },
    { id: 'c2', name: 'Priya Sharma', phone: '+1 (555) 876-5432', relation: 'Parent', isPrimary: false }
  ]
};

// GET /api/user/profile
const getUserProfile = async (req, res) => {
  try {
    if (getDBStatus()) {
      let user = await User.findOne();
      if (!user) {
        user = await User.create(inMemoryUser);
      }
      return res.status(200).json({ success: true, user });
    }
  } catch (e) {
    // fallback
  }

  return res.status(200).json({ success: true, user: inMemoryUser });
};

// PUT /api/user/profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, preferences, emergencyContacts } = req.body;

    if (name) inMemoryUser.name = name;
    if (preferences) inMemoryUser.preferences = { ...inMemoryUser.preferences, ...preferences };
    if (emergencyContacts) inMemoryUser.emergencyContacts = emergencyContacts;

    if (getDBStatus()) {
      try {
        let user = await User.findOne();
        if (user) {
          if (name) user.name = name;
          if (preferences) user.preferences = { ...user.preferences, ...preferences };
          if (emergencyContacts) user.emergencyContacts = emergencyContacts;
          await user.save();
          return res.status(200).json({ success: true, user });
        }
      } catch (err) {
        console.warn('DB update failed, using memory state');
      }
    }

    return res.status(200).json({ success: true, user: inMemoryUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
