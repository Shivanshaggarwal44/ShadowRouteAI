import React, { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Navigation, MapPin, Bell, Menu, X, Radio } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';
import BackendStatusIndicator from './BackendStatusIndicator';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, notifications, sosActive } = useApp();
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Clean minimal nav links (Requirement #44)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Safe Journey', path: '/routes' },
    { name: 'Safety Map', path: '/risk-map' },
    { name: 'Profile', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <RouterLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition">
                <Shield className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-slate-900 font-sans">
                    ShadowRoute
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-mono px-1.5 py-0.5 rounded font-extrabold tracking-wider border border-blue-200">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">SAFETY-FIRST NAVIGATION</p>
              </div>
            </RouterLink>

            <div className="hidden lg:block">
              <BackendStatusIndicator />
            </div>
          </div>

          {/* Desktop Navigation Links (#44) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <RouterLink
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition duration-150 ${
                  isActive(link.path)
                    ? 'text-blue-600 bg-blue-50 border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{link.name}</span>
              </RouterLink>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
              />
            </div>

            {/* CTA Button: Find Safest Route */}
            <button
              onClick={() => navigate('/routes')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 transition active:scale-95"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Find Safest Route</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <RouterLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition ${
                isActive(link.path)
                  ? 'text-blue-600 bg-blue-50 border border-blue-200'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{link.name}</span>
            </RouterLink>
          ))}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/routes');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>Find Safest Route</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
