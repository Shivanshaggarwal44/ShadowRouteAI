# 🛡️ ShadowRoute AI — AI-Powered Safe Navigation Platform

> **"Don't just find the fastest route. Find the safest way there."**
> 
> *AI-powered navigation platform that analyzes route safety, illumination, crowd activity, historical incident risks, and emergency facility proximity.*

---

## 🌟 Key Features

* 📍 **Real-Time Live GPS Integration**: Native browser geolocation with dynamic position updates and accuracy halos.
* 🗺️ **MapLibre GL JS Vector Map**: Clean, light, modern vector navigation map style.
* 🛡️ **AI Safety Risk Engine**: Dynamic 0–100 safety score computation balancing speed vs personal safety.
* 💡 **Illumination & Risk Corridors**: Real-time evaluation of street lighting, activity levels, and historical crime reports.
* 🚨 **Emergency SOS & Safe Havens**: 1-tap SOS telemetry broadcast and proximity routing to nearby Police, Hospitals, and Fire Stations.
* 🔄 **Live Route Deviation Detection**: Automatic notification and recalculation when drifting away from safer corridors.
* 🎉 **Journey Arrival Status**: Clean completion telemetry and journey safety score recap.

---

## 🚀 Quick Start

### 1. Prerequisites
* Node.js v18+
* npm v9+

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
# Client running on http://localhost:5173
```

---

## 📁 Project Architecture

```text
shadowroute-ai/
├── client/                 # React + MapLibre GL JS + Tailwind CSS
│   ├── src/
│   │   ├── components/     # MapLibreView, SearchPanel, RouteResultCard, NavigationModeHUD...
│   │   ├── context/        # AppContext single source of truth
│   │   ├── hooks/          # useLiveLocation custom browser GPS hook
│   │   ├── pages/          # Home, RouteAnalysis, Emergency, RiskMap, Profile
│   │   └── services/       # Centralized Axios API service layer
│   └── package.json
│
├── server/                 # Node.js + Express + MongoDB / Mock Fallback Engine
│   ├── controllers/        # routeController, emergencyController, riskZoneController
│   ├── services/           # riskAnalysisService (Weighted Safety Formula)
│   ├── models/             # Mongoose schemas (User, RouteAnalysis, Incident, RiskZone)
│   └── server.js
│
└── README.md
```

---

## 🛡️ License
MIT License — ShadowRoute AI
