const express = require('express');
const router = express.Router();
const { searchLocations } = require('../controllers/locationController');

// GET /api/location/search?q=query&userLat=lat&userLng=lng
router.get('/search', searchLocations);

module.exports = router;
