const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect DB (with automatic fallback to mock store if DB is offline)
connectDB();

// Routes
const routeRoutes = require('./routes/routeRoutes');
const riskZoneRoutes = require('./routes/riskZoneRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/routes', routeRoutes);
app.use('/api/risk-zones', riskZoneRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/user', userRoutes);

// Root health check endpoint (#24 requirement)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ShadowRoute AI'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ShadowRoute Server] Running on http://localhost:${PORT}`);
});
