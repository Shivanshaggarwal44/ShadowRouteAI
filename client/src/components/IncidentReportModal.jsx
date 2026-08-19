import React, { useState } from 'react';
import { AlertCircle, MapPin, Send, X, ShieldAlert } from 'lucide-react';
import { createIncidentAPI } from '../services/api';

const IncidentReportModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    locationName: 'Connaught Alley Underpass',
    latitude: 28.6190,
    longitude: 77.2050,
    type: 'Harassment',
    severity: 'High',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setLoading(true);
    try {
      const res = await createIncidentAPI(formData);
      if (res.success) {
        if (onSuccess) onSuccess(res.incident);
        onClose();
      }
    } catch (err) {
      console.error('Incident report error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">Report Safety Hazard / Incident</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Location Name</label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Hazard Category</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Harassment">Harassment</option>
                <option value="Poor Lighting">Poor Street Lighting</option>
                <option value="Road Block">Road Hazard / Obstruction</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Accident">Accident Prone</option>
                <option value="Lack of Patrol">No Patrols</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Severity Level</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Low">Low Caution</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Severity</option>
                <option value="Critical">Critical Hazard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Incident Details & Context</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe lighting, broken lights, group of individuals, or obstruction..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-cyan-500"
              required
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:opacity-95 transition"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>{loading ? 'Transmitting to AI Engine...' : 'Submit Incident Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentReportModal;
