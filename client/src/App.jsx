import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RouteAnalysis from './pages/RouteAnalysis';
import RiskMap from './pages/RiskMap';
import Emergency from './pages/Emergency';
import Profile from './pages/Profile';
import About from './pages/About';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-[#070A12] text-slate-100 bg-cyber-grid font-sans">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/routes" element={<RouteAnalysis />} />
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
