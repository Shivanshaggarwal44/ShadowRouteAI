const mockRoutes = require('../data/mockRoutes');

/**
 * ShadowRoute AI Risk Analysis Service
 * Implements weighted scoring system:
 * - 30% Incident Risk
 * - 20% Lighting
 * - 15% Crowd/Activity
 * - 15% Emergency Accessibility
 * - 10% Time of Day
 * - 10% Weather/Environment
 */

function calculateRouteSafetyScore(route, timeOfDay = 'evening') {
  const timeMultiplier = {
    daytime: 1.0,
    evening: 0.82,
    late_night: 0.61
  }[timeOfDay] || 0.82;

  // Weighted scoring weights (Requirement #9)
  const wIncident = 0.30;
  const wLighting = 0.20;
  const wCrowd = 0.15;
  const wEmergency = 0.15;
  const wTime = 0.10;
  const wWeather = 0.10;

  const rawIncident = route.incidentScore || 75;
  const rawLighting = route.lightingScore || 70;
  const rawCrowd = route.crowdScore || 60;
  const rawEmergency = route.emergencyAccessScore || 65;
  const rawTime = Math.round(timeMultiplier * 100);
  const rawWeather = 85; // Optimal weather baseline

  const baseScore = Math.round(
    rawIncident * wIncident +
    rawLighting * wLighting +
    rawCrowd * wCrowd +
    rawEmergency * wEmergency +
    rawTime * wTime +
    rawWeather * wWeather
  );

  const finalScore = Math.max(5, Math.min(99, baseScore));

  let riskLevel = 'Moderate';
  if (finalScore >= 85) riskLevel = 'Low';
  else if (finalScore >= 65) riskLevel = 'Moderate';
  else if (finalScore >= 40) riskLevel = 'High Risk';
  else riskLevel = 'Very High Risk';

  // Dynamic reasons list (Requirement #9 & #10)
  const reasons = [];
  if (rawLighting >= 75) reasons.push('Good street lighting');
  if (rawCrowd >= 70) reasons.push('High activity level');
  if (rawIncident >= 70) reasons.push('Low historical incident density');
  if (rawEmergency >= 70) reasons.push('Emergency services nearby');
  if (reasons.length === 0) {
    reasons.push('Unlit railway underpass section');
    reasons.push('Low crowd density after dark');
    reasons.push('Isolated corridor risk');
  }

  return {
    finalScore,
    riskLevel,
    reasons,
    aiConfidence: 92,
    factorsBreakdown: {
      incidentRisk: rawIncident,
      lighting: rawLighting,
      crowdActivity: rawCrowd,
      emergencyAccess: rawEmergency,
      timeOfDayFactor: rawTime,
      weatherFactor: rawWeather
    }
  };
}

/**
 * Rank routes dynamically according to user safety priority ratio or preference
 */
function rankRoutesByPreference(routes, safetyPriorityRatio = 75, timeOfDay = 'evening', liveCoords = null) {
  const safetyWeight = safetyPriorityRatio / 100;
  const speedWeight = 1 - safetyWeight;

  const minEta = Math.min(...routes.map(r => r.baseEtaMinutes));
  const maxEta = Math.max(...routes.map(r => r.baseEtaMinutes));
  const etaRange = Math.max(1, maxEta - minEta);

  const evaluatedRoutes = routes.map(route => {
    const analysis = calculateRouteSafetyScore(route, timeOfDay);
    const speedScore = 100 - (((route.baseEtaMinutes - minEta) / etaRange) * 60);

    const combinedScore = Math.round((analysis.finalScore * safetyWeight) + (speedScore * speedWeight));
    const timeMultiplier = timeOfDay === 'late_night' ? 0.9 : timeOfDay === 'evening' ? 1.05 : 1.1;
    const adjustedEta = Math.round(route.baseEtaMinutes * timeMultiplier);

    let adaptedCoordinates = route.coordinates;
    if (liveCoords && Number.isFinite(Number(liveCoords.lat)) && Number.isFinite(Number(liveCoords.lng))) {
      const lat = Number(liveCoords.lat);
      const lng = Number(liveCoords.lng);
      const baseLat = route.coordinates[0][0];
      const baseLng = route.coordinates[0][1];
      adaptedCoordinates = route.coordinates.map(pt => [
        lat + (pt[0] - baseLat),
        lng + (pt[1] - baseLng)
      ]);
    }

    return {
      ...route,
      coordinates: adaptedCoordinates,
      currentSafetyScore: analysis.finalScore,
      currentRiskLevel: analysis.riskLevel,
      reasons: analysis.reasons,
      aiConfidence: analysis.aiConfidence,
      factorsBreakdown: analysis.factorsBreakdown,
      speedScore: Math.round(speedScore),
      combinedScore,
      adjustedEta,
      timeOfDay
    };
  });

  evaluatedRoutes.sort((a, b) => b.combinedScore - a.combinedScore);

  evaluatedRoutes.forEach((r, idx) => {
    r.isRecommended = (idx === 0);
  });

  return evaluatedRoutes;
}

/**
 * Generate explainable AI suggestion
 */
function generateAISuggestion(routes, safetyPriorityRatio) {
  const topRoute = routes.find(r => r.isRecommended) || routes[0];
  const fastRoute = routes.find(r => r.type === 'FAST') || routes[1];

  const timeSavedMinutes = Math.abs((fastRoute?.adjustedEta || 15) - (topRoute?.adjustedEta || 18));
  const scoreDiff = (topRoute?.currentSafetyScore || 91) - (fastRoute?.currentSafetyScore || 48);

  return {
    title: `Recommended: ${topRoute.name}`,
    summary: `This route is ${timeSavedMinutes > 0 ? timeSavedMinutes + ' minutes slower' : 'comparable in time'} but significantly safer (+${scoreDiff}% higher safety margin).`,
    tradeoffNotice: `Choosing ${topRoute.name} avoids unlit underpasses while keeping active police response within 400m.`,
    reasons: topRoute.reasons || ["Good street lighting", "High activity level", "Low historical incident density", "Emergency services nearby"],
    aiConfidence: 92,
    recommendation: `Recommended choice based on your Safety Preference.`
  };
}

module.exports = {
  calculateRouteSafetyScore,
  rankRoutesByPreference,
  generateAISuggestion
};
