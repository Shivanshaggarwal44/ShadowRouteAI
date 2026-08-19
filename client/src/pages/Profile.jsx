import React, { useState } from 'react';
import { User, Shield, PhoneCall, Bell, Lock, CheckCircle2, Save, Plus, Trash2, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updateUserProfileAPI } from '../services/api';

const Profile = () => {
  const { user, setUser, safetyPriority, setSafetyPriority, handleSliderChange } = useApp();

  const [name, setName] = useState(user?.name || 'Shivansh Sharma');
  const [email, setEmail] = useState(user?.email || 'shivansh@shadowroute.ai');
  const [contacts, setContacts] = useState(user?.emergencyContacts || [
    { id: 'c1', name: 'Aarav Sharma', phone: '+1 (555) 234-5678', relation: 'Brother', isPrimary: true },
    { id: 'c2', name: 'Priya Sharma', phone: '+1 (555) 876-5432', relation: 'Parent', isPrimary: false }
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Friend');

  const [savedNotice, setSavedNotice] = useState(false);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    
    const newEntry = {
      id: `c_${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relation: newContactRelation,
      isPrimary: false
    };

    const updated = [...contacts, newEntry];
    setContacts(updated);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        name,
        preferences: {
          safetyPriority,
          avoidHighRiskZones: true,
          autoRerouteOnDeviation: true
        },
        emergencyContacts: contacts
      };
      await updateUserProfileAPI(payload);
      setUser(prev => ({ ...prev, name, emergencyContacts: contacts }));
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.warn('Profile save warning:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            User Profile & Safety Preferences
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your AI safety threshold, emergency SOS dispatch contacts, and security settings.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:opacity-95 transition"
        >
          <Save className="w-4 h-4 fill-slate-950" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* USER DETAILS CARD */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-2xl space-y-6">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Personal Account Details</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt="Profile"
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-xl"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SAFETY PRIORITY CONTROL (#20) */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">Default AI Safety Priority</h2>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
            Safety Priority: {safetyPriority}%
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Set your baseline navigation formula priority. Higher safety priority will automatically filter unlit shortcuts, isolated paths, and low pedestrian density corridors.
        </p>

        <input
          type="range"
          min="0"
          max="100"
          value={safetyPriority}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>⚡ 0% (Fastest Time Priority)</span>
          <span>⚖️ 50% Balanced</span>
          <span>🛡️ 100% (Maximum Risk Avoidance)</span>
        </div>
      </div>

      {/* EMERGENCY CONTACTS MANAGER (#20) */}
      <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-slate-100">Emergency SOS Dispatch Contacts</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">AUTOMATIC SMS BROADCAST</span>
        </div>

        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                  {c.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <span>{c.name}</span>
                    {c.isPrimary && (
                      <span className="text-[10px] font-mono bg-rose-500 text-white px-1.5 py-0.2 rounded">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 font-mono text-[11px]">{c.phone} • ({c.relation})</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteContact(c.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Contact Form */}
        <form onSubmit={handleAddContact} className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="block text-slate-400 font-mono mb-1">CONTACT NAME</label>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-mono mb-1">PHONE NUMBER</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-mono mb-1">RELATION</label>
            <input
              type="text"
              placeholder="Family / Friend"
              value={newContactRelation}
              onChange={(e) => setNewContactRelation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Profile;
