const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const User = require('./models/User');
const RiskZone = require('./models/RiskZone');
const Incident = require('./models/Incident');

const mockRiskZones = require('./data/mockRiskZones');
const mockIncidents = require('./data/mockIncidents');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing database collections...');

    await User.deleteMany();
    await RiskZone.deleteMany();
    await Incident.deleteMany();

    console.log('[Seed] Populating initial seed datasets...');

    await User.create({
      name: 'Shivansh Sharma',
      email: 'shivansh@shadowroute.ai',
      preferences: {
        safetyPriority: 80,
        avoidHighRiskZones: true,
        nightNavigationMode: true,
        autoRerouteOnDeviation: true,
        locationPermission: true
      },
      emergencyContacts: [
        { name: 'Aarav Sharma', phone: '+1 (555) 234-5678', relation: 'Brother', isPrimary: true },
        { name: 'Priya Sharma', phone: '+1 (555) 876-5432', relation: 'Parent', isPrimary: false }
      ]
    });

    await RiskZone.insertMany(mockRiskZones);
    await Incident.insertMany(mockIncidents);

    console.log('[Seed] Database seeded successfully! 🚀');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();
