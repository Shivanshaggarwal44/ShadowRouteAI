const express = require('express');
const router = express.Router();
const { getRiskZones, getIncidents, createIncident } = require('../controllers/riskZoneController');

router.get('/', getRiskZones);
router.get('/incidents', getIncidents);
router.post('/incidents', createIncident);

module.exports = router;
