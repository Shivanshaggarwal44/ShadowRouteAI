const express = require('express');
const router = express.Router();
const { getEmergencyServices, triggerSOS } = require('../controllers/emergencyController');

router.get('/services', getEmergencyServices);
router.post('/sos', triggerSOS);

module.exports = router;
