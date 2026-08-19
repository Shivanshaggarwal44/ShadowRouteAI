const mockIncidents = [
  {
    id: 'inc_01',
    locationName: 'Railway Underpass Mile 2.1',
    latitude: 28.6180,
    longitude: 77.2045,
    type: 'Harassment',
    severity: 'High',
    timestamp: new Date(Date.now() - 3600000 * 14).toISOString(), // 14h ago
    description: 'Group of suspicious individuals harassing lone commuters under unlit railway bridge.',
    upvotes: 24,
    verified: true
  },
  {
    id: 'inc_02',
    locationName: 'Industrial Godown Lane',
    latitude: 28.6225,
    longitude: 77.2035,
    type: 'Poor Lighting',
    severity: 'Medium',
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    description: 'All 6 municipal streetlights along a 300m stretch are non-functional.',
    upvotes: 18,
    verified: true
  },
  {
    id: 'inc_03',
    locationName: 'Eastern Flyover Divergence',
    latitude: 28.6245,
    longitude: 77.2290,
    type: 'Road Block',
    severity: 'Low',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    description: 'Construction barrier partially blocking pedestrian pavement.',
    upvotes: 7,
    verified: false
  },
  {
    id: 'inc_04',
    locationName: 'Canal South Path',
    latitude: 28.6115,
    longitude: 77.2155,
    type: 'Suspicious Activity',
    severity: 'Medium',
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    description: 'Unattended vehicle parked along narrow walkway with obscured plates.',
    upvotes: 12,
    verified: true
  }
];

module.exports = mockIncidents;
