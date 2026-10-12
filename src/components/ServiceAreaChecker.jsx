import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { fetchApi } from '../utils/api';

export default function ServiceAreaChecker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const data = await fetchApi('/location/check-availability', {
        method: 'POST',
        body: JSON.stringify({ area_or_pincode: input.trim() })
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickCheckArea = (areaName) => {
    setInput(areaName);
    setTimeout(() => {
      fetchApi('/location/check-availability', {
        method: 'POST',
        body: JSON.stringify({ area_or_pincode: areaName })
      }).then(res => setResult(res));
    }, 50);
  };

  return (
    <div className="bg-navy-800/80 rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-blue-600/20 text-cyanAccent">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white">Coimbatore Service Area Checker</h3>
          <p className="text-xs text-slate-300">Check if Doorstep Service & Pickup is available in your neighborhood or pincode.</p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Coimbatore area or pincode (e.g. Gandhipuram, RS Puram, 641004)..."
            className="w-full bg-navy-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyanAccent outline-none pl-10"
          />
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/40 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Check</span>
        </button>
      </form>

      {/* Quick Location Pills */}
      <div className="space-y-2">
        <span className="text-[11px] text-slate-400 font-medium block">Popular Coimbatore Locations:</span>
        <div className="flex flex-wrap gap-2 text-xs">
          {['Gandhipuram', 'RS Puram', 'Peelamedu', 'Saravanampatti', 'Singanallur', 'Ukkadam', 'Race Course'].map(area => (
            <button
              key={area}
              onClick={() => quickCheckArea(area)}
              className="px-3 py-1 rounded-lg bg-navy-900 hover:bg-navy-700 text-slate-300 border border-white/5"
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Result Indicator */}
      {result && (
        <div className={`p-4 rounded-2xl border transition-all animate-in fade-in duration-300 ${
          result.available
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            {result.available ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <span>{result.badge}</span>
          </div>
          <p className="text-xs text-slate-200">{result.message}</p>
        </div>
      )}
    </div>
  );
}
