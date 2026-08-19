const express = require('express');
const router = express.Router();
const { analyzeRoutes, recalculateRoute, getRouteById, getRouteHistory } = require('../controllers/routeController');

router.post('/analyze', analyzeRoutes);
router.post('/recalculate', recalculateRoute);
router.get('/history/summary', getRouteHistory);
router.get('/:id', getRouteById);

module.exports = router;
