export const fallbackRoutes = [
  {
    id: 'route_b_safe',
    name: 'Grand Boulevard & Tech Corridor (Recommended Safe Route)',
    type: 'SAFE',
    tag: 'Recommended Safe Route',
    baseEtaMinutes: 18,
    adjustedEta: 18,
    distanceKm: 6.8,
    safetyScore: 89,
    currentSafetyScore: 89,
    riskLevel: 'Low',
    currentRiskLevel: 'Safe',
    color: '#10B981',
    isRecommended: true,
    lightingScore: 92,
    crowdScore: 88,
    incidentScore: 95,
    emergencyAccessScore: 90,
    factors: [
      'Well-lit 4-lane avenue with operational LED streetlamps',
      'High evening pedestrian activity and open retail shops',
      'Police Checkpoint stationed within 400m radius',
      'Zero reported incidents in past 90 days',
      'CCTV surveillance operational across 95% of route'
    ],
    factorsBreakdown: {
      lighting: 92,
      crowdDensity: 88,
      incidentHistory: 95,
      emergencyProximity: 90,
      surveillanceCoverage: 95
    },
    coordinates: [
      [28.6139, 77.2090],
      [28.6185, 77.2135],
      [28.6230, 77.2180],
      [28.6280, 77.2210],
      [28.6330, 77.2250]
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
    adjustedEta: 15,
    distanceKm: 6.2,
    safetyScore: 42,
    currentSafetyScore: 42,
    riskLevel: 'High Risk',
    currentRiskLevel: 'High Risk',
    color: '#EF4444',
    isRecommended: false,
    lightingScore: 35,
    crowdScore: 30,
    incidentScore: 45,
    emergencyAccessScore: 50,
    factors: [
      'Unlit underpass under railway tracks (30% lights non-functional)',
      'Low crowd density after 7:30 PM',
      '3 harassment incidents reported in last 30 days',
      'Poor cellular signal in tunnel corridor',
      'No emergency response stations within 1.5 km'
    ],
    factorsBreakdown: {
      lighting: 35,
      crowdDensity: 30,
      incidentHistory: 45,
      emergencyProximity: 50,
      surveillanceCoverage: 25
    },
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
    adjustedEta: 20,
    distanceKm: 7.1,
    safetyScore: 67,
    currentSafetyScore: 67,
    riskLevel: 'Moderate',
    currentRiskLevel: 'Moderate',
    color: '#F59E0B',
    isRecommended: false,
    lightingScore: 70,
    crowdScore: 65,
    incidentScore: 72,
    emergencyAccessScore: 60,
    factors: [
      'Moderate street lighting along main flyover',
      'Regular vehicular traffic but few pedestrians',
      '1 ongoing road construction hazard',
      'Fire station within 1.2 km'
    ],
    factorsBreakdown: {
      lighting: 70,
      crowdDensity: 65,
      incidentHistory: 72,
      emergencyProximity: 60,
      surveillanceCoverage: 65
    },
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

export const getAdaptedFallbackRoutes = (userLat, userLng) => {
  if (!userLat || !userLng || !Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    return fallbackRoutes;
  }

  return fallbackRoutes.map(route => {
    const baseLat = route.coordinates[0][0];
    const baseLng = route.coordinates[0][1];
    const adaptedCoordinates = route.coordinates.map(pt => [
      userLat + (pt[0] - baseLat),
      userLng + (pt[1] - baseLng)
    ]);
    return {
      ...route,
      coordinates: adaptedCoordinates
    };
  });
};

export const fallbackAISuggestion = {
  title: 'Recommended: Grand Boulevard & Tech Corridor',
  summary: 'Shadow AI analyzed hidden risks, lighting density, and historical police reports. Grand Boulevard & Tech Corridor achieves an 89/100 Safety Score (Safe), compared to Underpass Shortcut (42/100 High Risk).',
  tradeoffNotice: 'Choosing Grand Boulevard & Tech Corridor adds only 3 extra minutes to your journey while increasing your safety margin by +47% points.',
  recommendation: 'Recommended choice based on your 75% Safety Priority setting.'
};
