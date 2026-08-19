const mockRoutes = require('../data/mockRoutes');
const { rankRoutesByPreference, generateAISuggestion } = require('../services/riskAnalysisService');
const RouteAnalysis = require('../models/RouteAnalysis');
const { getDBStatus } = require('../config/db');

// POST /api/routes/analyze
const analyzeRoutes = async (req, res) => {
  try {
    const {
      origin = 'Central Metro Station',
      destination = 'Cyber Tech Park',
      preference = 'balanced', // faster | balanced | safer
      safetyPriority = 75,
      timeOfDay = 'evening',
      userLat,
      userLng
    } = req.body;

    const liveCoords = (userLat && userLng) ? { lat: Number(userLat), lng: Number(userLng) } : null;

    // Convert preference keyword to priority ratio if provided
    let priorityRatio = Number(safetyPriority);
    if (preference === 'faster') priorityRatio = 20;
    else if (preference === 'safer') priorityRatio = 90;
    else if (preference === 'balanced') priorityRatio = 60;

    // Rank routes using dynamic AI service with live GPS adaptivity
    const rankedRoutes = rankRoutesByPreference(mockRoutes, priorityRatio, timeOfDay, liveCoords);
    const aiSuggestion = generateAISuggestion(rankedRoutes, priorityRatio);

    const topRoute = rankedRoutes.find(r => r.isRecommended) || rankedRoutes[0];

    // Save history if DB is active
    if (getDBStatus()) {
      try {
        await RouteAnalysis.create({
          userId: 'shivansh_01',
          origin,
          destination,
          distance: `${topRoute.distanceKm} km`,
          duration: `${topRoute.adjustedEta} min`,
          safetyScore: topRoute.currentSafetyScore,
          riskLevel: topRoute.currentRiskLevel,
          riskFactors: topRoute.factors,
          preferenceRatio: priorityRatio,
          timeOfDay,
          selectedRouteId: topRoute.id
        });
      } catch (err) {
        console.warn('Could not save route analysis log to DB:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      origin,
      destination,
      preference,
      safetyPriorityRatio: priorityRatio,
      timeOfDay,
      routes: rankedRoutes,
      aiSuggestion,
      liveCoords,
      analyzedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Route analysis error:', error);
    return res.status(500).json({ success: false, message: 'Failed to analyze routes', error: error.message });
  }
};

// POST /api/routes/recalculate (Deviation or preferences change)
const recalculateRoute = async (req, res) => {
  try {
    const { origin, destination, preference = 'safer', timeOfDay = 'evening', userLat, userLng } = req.body;

    const liveCoords = (userLat && userLng) ? { lat: Number(userLat), lng: Number(userLng) } : null;
    const priorityRatio = preference === 'safer' ? 95 : 70;

    const rankedRoutes = rankRoutesByPreference(mockRoutes, priorityRatio, timeOfDay, liveCoords);
    const aiSuggestion = generateAISuggestion(rankedRoutes, priorityRatio);

    return res.status(200).json({
      success: true,
      message: 'Safe route recalculated successfully.',
      routes: rankedRoutes,
      aiSuggestion,
      recalculatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Recalculation failed', error: error.message });
  }
};

// GET /api/routes/:id
const getRouteById = async (req, res) => {
  const { id } = req.params;
  const route = mockRoutes.find(r => r.id === id);

  if (!route) {
    return res.status(404).json({ success: false, message: 'Route not found' });
  }

  return res.status(200).json({ success: true, route });
};

// GET /api/routes/history/summary
const getRouteHistory = async (req, res) => {
  try {
    if (getDBStatus()) {
      const history = await RouteAnalysis.find().sort({ createdAt: -1 }).limit(10);
      return res.status(200).json({ success: true, history });
    }
  } catch (e) {
    // fallback
  }

  return res.status(200).json({
    success: true,
    stats: {
      routesAnalyzed: 24,
      safeRoutesTaken: 18,
      averageSafetyScore: 87,
      riskZonesAvoided: 12
    }
  });
};

module.exports = {
  analyzeRoutes,
  recalculateRoute,
  getRouteById,
  getRouteHistory
};
