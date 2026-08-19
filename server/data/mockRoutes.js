const mockRoutes = [
  {
    id: 'route_b_safe',
    name: 'Grand Boulevard & Tech Corridor (Recommended Safe Route)',
    type: 'SAFE',
    tag: 'Recommended Safe Route',
    baseEtaMinutes: 18,
    distanceKm: 6.8,
    safetyScore: 89,
    riskLevel: 'Low',
    color: '#10B981', // Emerald green
    lightingScore: 92,
    crowdScore: 88,
    incidentScore: 95,
    emergencyAccessScore: 90,
    timeOfDayScores: {
      daytime: 94,
      evening: 89,
      late_night: 76
    },
    factors: [
      'Well-lit 4-lane avenue with operational LED streetlamps',
      'High evening pedestrian activity and open retail shops',
      'Police Checkpoint stationed within 400m radius',
      'Zero reported incidents in past 90 days',
      'CCTV surveillance operational across 95% of route'
    ],
    riskHighlights: [
      'Slight evening traffic delay near Financial Circle (+3 mins)'
    ],
    coordinates: [
      [28.6139, 77.2090], // Start: Connaught Hub
      [28.6185, 77.2135],
      [28.6230, 77.2180],
      [28.6280, 77.2210],
      [28.6330, 77.2250]  // End: Cyber Tech Park
    ],
    waypoints: [
      { name: 'Central Metro Station Gate 3', safe: true, info: 'CCTV Monitored' },
      { name: 'Financial Hub Plaza', safe: true, info: 'Police Booth Active' },
      { name: 'Innovate Park Boulevard', safe: true, info: 'High Pedestrian Density' }
    ]
  },
  {
    id: 'route_a_fast',
    name: 'Underpass & Industrial Alley Shortcut (Fastest)',
    type: 'FAST',
    tag: 'Fastest Route (High Risk)',
    baseEtaMinutes: 15,
    distanceKm: 6.2,
    safetyScore: 42,
    riskLevel: 'High Risk',
    color: '#EF4444', // Red
    lightingScore: 35,
    crowdScore: 30,
    incidentScore: 45,
    emergencyAccessScore: 50,
    timeOfDayScores: {
      daytime: 68,
      evening: 42,
      late_night: 24
    },
    factors: [
      'Unlit underpass under railway tracks (30% lights non-functional)',
      'Low crowd density after 7:30 PM',
      '3 harassment incidents reported in last 30 days',
      'Poor cellular signal in tunnel corridor',
      'No emergency response stations within 1.5 km'
    ],
    riskHighlights: [
      'Severe safety hazard after dark',
      'High historical mugging and harassment rate'
    ],
    coordinates: [
      [28.6139, 77.2090],
      [28.6170, 77.2050],
      [28.6220, 77.2030],
      [28.6290, 77.2150],
      [28.6330, 77.2250]
    ],
    waypoints: [
      { name: 'Railway Bridge Underpass', safe: false, info: '30% Lights Out' },
      { name: 'Old Industrial Godown Lane', safe: false, info: 'Isolated Corridor' }
    ]
  },
  {
    id: 'route_c_balanced',
    name: 'Ring Road & Eastern Expressway',
    type: 'BALANCED',
    tag: 'Moderate Route',
    baseEtaMinutes: 20,
    distanceKm: 7.1,
    safetyScore: 67,
    riskLevel: 'Moderate',
    color: '#F59E0B', // Amber
    lightingScore: 70,
    crowdScore: 65,
    incidentScore: 72,
    emergencyAccessScore: 60,
    timeOfDayScores: {
      daytime: 80,
      evening: 67,
      late_night: 52
    },
    factors: [
      'Moderate street lighting along main flyover',
      'Regular vehicular traffic but few pedestrians',
      '1 ongoing road construction hazard',
      'Fire station within 1.2 km'
    ],
    riskHighlights: [
      'Construction narrow lanes near km 4.5',
      'Moderate night visibility'
    ],
    coordinates: [
      [28.6139, 77.2090],
      [28.6120, 77.2180],
      [28.6200, 77.2290],
      [28.6280, 77.2280],
      [28.6330, 77.2250]
    ],
    waypoints: [
      { name: 'Eastern Expressway Flyover', safe: true, info: 'Heavy Vehicular Traffic' },
      { name: 'Construction Divergence', safe: false, info: 'Narrow Lane Hazard' }
    ]
  }
];

module.exports = mockRoutes;
