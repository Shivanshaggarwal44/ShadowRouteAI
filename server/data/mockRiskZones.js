const mockRiskZones = [
  {
    id: 'zone_red_01',
    name: 'Old Industrial Railway Corridor',
    latitude: 28.6210,
    longitude: 77.2040,
    radius: 650,
    riskScore: 35, // High Risk (0-100 safety)
    riskLevel: 'High',
    color: '#EF4444',
    factors: [
      'Frequent streetlamp power outages',
      'High density of deserted godowns',
      'Low police patrolling frequency',
      '4 harassment reports filed in last 60 days'
    ],
    historicalIncidentsCount: 8,
    emergencyServicesNearby: {
      police: false,
      hospital: true,
      fireStation: false
    },
    recommendedPrecautions: [
      'Avoid walking alone after 8:00 PM',
      'Keep location sharing active',
      'Use main Grand Boulevard detour'
    ]
  },
  {
    id: 'zone_yellow_02',
    name: 'Eastern Flyover Construction Hub',
    latitude: 28.6240,
    longitude: 77.2285,
    radius: 500,
    riskScore: 62,
    riskLevel: 'Moderate',
    color: '#F59E0B',
    factors: [
      'Road construction narrows pedestrian walkways',
      'Heavy truck traffic during night hours',
      'Temporary lighting installations'
    ],
    historicalIncidentsCount: 3,
    emergencyServicesNearby: {
      police: true,
      hospital: false,
      fireStation: true
    },
    recommendedPrecautions: [
      'Watch for construction barrier debris',
      'Use high-visibility reflection gear if cycling'
    ]
  },
  {
    id: 'zone_green_03',
    name: 'Financial Hub Safe Sanctuary Zone',
    latitude: 28.6230,
    longitude: 77.2180,
    radius: 700,
    riskScore: 94,
    riskLevel: 'Low',
    color: '#10B981',
    factors: [
      '24/7 Police Checkpoint with patrol vehicles',
      'Bright LED illumination across all pavements',
      'Active commercial area with 24h bank ATMs and kiosks',
      'AI smart CCTV camera coverage'
    ],
    historicalIncidentsCount: 0,
    emergencyServicesNearby: {
      police: true,
      hospital: true,
      fireStation: true
    },
    recommendedPrecautions: [
      'Designated Safe Haven Zone - Rest area available'
    ]
  },
  {
    id: 'zone_orange_04',
    name: 'Suburban Canal Overpass Corridor',
    latitude: 28.6110,
    longitude: 77.2150,
    radius: 450,
    riskScore: 48,
    riskLevel: 'Elevated',
    color: '#F97316',
    factors: [
      'Dim LED fixtures along canal path',
      'Isolated walkway with limited emergency exit points',
      'Low cell phone reception near underpass'
    ],
    historicalIncidentsCount: 5,
    emergencyServicesNearby: {
      police: false,
      hospital: false,
      fireStation: false
    },
    recommendedPrecautions: [
      'Reroute via Main Ring Road during night hours',
      'Prepare emergency whistle or SOS alert trigger'
    ]
  }
];

module.exports = mockRiskZones;
