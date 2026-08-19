const mockEmergencyServices = [
  {
    id: 'police_01',
    name: 'Central District Police Station (HQ)',
    type: 'Police',
    icon: '🚔',
    latitude: 28.6235,
    longitude: 77.2175,
    distanceKm: 0.6,
    etaMinutes: 2,
    phone: '+1 (800) 555-0199',
    address: '45 Financial Hub Boulevard, Sector 4',
    status: 'Open 24/7 • Active Patrol Response'
  },
  {
    id: 'police_02',
    name: 'North Cyber Park Police Outpost',
    type: 'Police',
    icon: '🚔',
    latitude: 28.6310,
    longitude: 77.2240,
    distanceKm: 1.4,
    etaMinutes: 4,
    phone: '+1 (800) 555-0188',
    address: '12 Tech Park Way, Gate 1',
    status: 'Open 24/7'
  },
  {
    id: 'hospital_01',
    name: 'Metropolitan General Emergency Hospital',
    type: 'Hospital',
    icon: '🏥',
    latitude: 28.6260,
    longitude: 77.2210,
    distanceKm: 0.9,
    etaMinutes: 3,
    phone: '+1 (800) 555-9110',
    address: '88 Healthcare Avenue',
    status: 'Level 1 Trauma Center • Ambulance Ready'
  },
  {
    id: 'hospital_02',
    name: 'City Care Urgent Care Clinic',
    type: 'Hospital',
    icon: '🏥',
    latitude: 28.6160,
    longitude: 77.2110,
    distanceKm: 1.8,
    etaMinutes: 5,
    phone: '+1 (800) 555-9112',
    address: '102 Connaught Street',
    status: 'Open till 11 PM'
  },
  {
    id: 'fire_01',
    name: 'Central Fire Depot #4',
    type: 'Fire Station',
    icon: '🚒',
    latitude: 28.6200,
    longitude: 77.2270,
    distanceKm: 1.2,
    etaMinutes: 4,
    phone: '+1 (800) 555-0101',
    address: '15 Expressway Ring Road',
    status: '24/7 Fire & Rescue Dispatch'
  }
];

module.exports = mockEmergencyServices;
