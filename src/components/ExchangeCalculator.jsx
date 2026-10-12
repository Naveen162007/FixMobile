import React, { useState } from 'react';
import { RefreshCw, ArrowLeftRight, Check, AlertCircle, Smartphone, ArrowRight } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR } from '../utils/formatters';

export default function ExchangeCalculator({ onBookRepair }) {
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 12');
  const [storage, setStorage] = useState('128GB');
  const [ageMonths, setAgeMonths] = useState(18);
  const [condition, setCondition] = useState('Good');
  const [screenOk, setScreenOk] = useState(true);
  const [batteryOk, setBatteryOk] = useState(true);
  const [isWorking, setIsWorking] = useState(true);

  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEvaluate = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const data = await fetchApi('/exchange/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          brand,
          model,
          storage,
          age_months: ageMonths,
          condition,
          screen_ok: screenOk,
          battery_ok: batteryOk,
          is_working: isWorking
        })
      });
      setValuation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPickup = async () => {
    try {
      await fetchApi('/exchange/request', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: 'Customer Request',
          customer_phone: '+91 98765 43210',
          brand,
          model,
          storage,
          age_months: ageMonths,
          condition,
          screen_ok: screenOk,
          battery_ok: batteryOk,
          is_working: isWorking,
          estimated_val: valuation?.estimatedExchangeValue || 5000
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-16 bg-navy-900 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Old Device Trade-In</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Old Phone Exchange & Value Estimator
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Trade in your pre-owned mobile device or compare whether to repair or upgrade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
              Device Condition Assessment
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                >
                  <option>Apple</option>
                  <option>Samsung</option>
                  <option>OnePlus</option>
                  <option>Xiaomi</option>
                  <option>Vivo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Storage</label>
                <select
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                >
                  <option>64GB</option>
                  <option>128GB</option>
                  <option>256GB</option>
                  <option>512GB</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Overall Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                >
                  <option value="Flawless">Flawless (Like New)</option>
                  <option value="Good">Good (Minor Scratches)</option>
                  <option value="Fair">Fair (Visible Scuffs)</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-slate-300">Front Display Glass Shattered?</span>
                <button
                  type="button"
                  onClick={() => setScreenOk(!screenOk)}
                  className={`px-3 py-1 rounded-lg font-bold ${screenOk ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}
                >
                  {screenOk ? 'Screen Intact' : 'Cracked Screen'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-navy-800 rounded-xl border border-white/5">
                <span className="text-slate-300">Device Boots Up & Functions?</span>
                <button
                  type="button"
                  onClick={() => setIsWorking(!isWorking)}
                  className={`px-3 py-1 rounded-lg font-bold ${isWorking ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}
                >
                  {isWorking ? 'Working' : 'Dead / Non-Working'}
                </button>
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Calculate Exchange Value</span>
            </button>
          </div>

          {/* Results & Comparison Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Valuation Display */}
            {valuation && (
              <div className="glass-card rounded-3xl p-6 border border-purple-500/30 glow-purple space-y-4 animate-in fade-in duration-300">
                <span className="text-xs text-slate-400 block font-semibold">Estimated Trade-In Quote</span>
                <div>
                  <span className="text-3xl font-extrabold text-amber-300">
                    {formatINR(valuation.estimatedExchangeValue)}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    *Subject to physical inspection at our Coimbatore studio.
                  </span>
                </div>

                {submitted ? (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold text-center">
                    ✅ Exchange request submitted! Our executive will call you for doorstep verification.
                  </div>
                ) : (
                  <button
                    onClick={handleRequestPickup}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Request Doorstep Trade-In Inspection
                  </button>
                )}
              </div>
            )}

            {/* Repair VS Exchange Comparison Card */}
            <div className="bg-navy-800/80 rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-cyanAccent font-bold text-sm">
                <ArrowLeftRight className="w-5 h-5" />
                <span>Should I Repair or Exchange?</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-navy-900 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Option A: Repair</span>
                  <span className="font-extrabold text-emerald-400 block">Avg ₹1,499 – ₹2,499</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Best if device is under 2 years old and only screen/battery is damaged.
                  </p>
                </div>

                <div className="p-3 bg-navy-900 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Option B: Exchange</span>
                  <span className="font-extrabold text-purple-300 block">Trade-In Value</span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Best if motherboard is dead or upgrade to new 5G model is desired.
                  </p>
                </div>
              </div>

              <button
                onClick={onBookRepair}
                className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-700 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Proceed with Repair Service Instead</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
