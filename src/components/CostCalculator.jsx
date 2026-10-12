import React, { useState, useEffect } from 'react';
import { Calculator, Smartphone, ShieldCheck, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR } from '../utils/formatters';

export default function CostCalculator({ onBookCalculated }) {
  const [brands, setBrands] = useState(['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Vivo', 'Oppo', 'Realme', 'Google', 'Motorola']);
  const [selectedBrand, setSelectedBrand] = useState('Apple');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('iPhone 14');
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(1);
  const [quality, setQuality] = useState('Original');

  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch models for brand
  useEffect(() => {
    fetchApi(`/services/models?brand=${selectedBrand}`)
      .then(data => {
        setModels(data);
        if (data.length > 0) setSelectedModel(data[0].name);
      })
      .catch(console.error);
  }, [selectedBrand]);

  // Fetch services
  useEffect(() => {
    fetchApi('/services')
      .then(data => {
        setServices(data);
        if (data.length > 0) setSelectedServiceId(data[0].id);
      })
      .catch(console.error);
  }, []);

  // Recalculate cost when selections change
  useEffect(() => {
    if (!selectedBrand || !selectedModel || !selectedServiceId) return;

    setLoading(true);
    fetchApi('/services/calculate-cost', {
      method: 'POST',
      body: JSON.stringify({
        brand: selectedBrand,
        model: selectedModel,
        service_id: selectedServiceId,
        quality
      })
    })
      .then(res => setCalculation(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedBrand, selectedModel, selectedServiceId, quality]);

  return (
    <section id="cost-calculator" className="py-16 bg-navy-900 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyanAccent text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Transparent Pricing Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Repair Cost Calculator
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Calculate instant estimated prices based on your exact device model and part quality tier.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Brand selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">1. Select Brand</label>
              <div className="flex flex-wrap gap-2">
                {brands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedBrand === b
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 scale-105'
                        : 'bg-navy-800 text-slate-300 hover:bg-navy-700 border border-white/5'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Model selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">2. Select Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none font-medium"
              >
                {models.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Service Repair Type */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">3. Repair Service Type</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none font-medium"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name} (Base ₹{s.base_price})</option>
                ))}
              </select>
            </div>

            {/* Part Quality Tier */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">4. Part Quality Grade</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Original', desc: '100% Factory Grade' },
                  { name: 'OEM', desc: 'High Quality OEM' },
                  { name: 'Compatible', desc: 'Budget Friendly' }
                ].map(q => (
                  <button
                    key={q.name}
                    onClick={() => setQuality(q.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      quality === q.name
                        ? 'bg-blue-600/20 border-cyanAccent text-white shadow-md'
                        : 'bg-navy-800 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-extrabold block text-white">{q.name}</span>
                    <span className="text-[10px] block opacity-80">{q.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 glow-blue">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Live Price Quote</span>
                  <h3 className="text-lg font-bold text-white">{selectedBrand} {selectedModel}</h3>
                </div>
                <span className="p-2.5 rounded-xl bg-blue-600/20 text-cyanAccent">
                  <Smartphone className="w-5 h-5" />
                </span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-slate-400 text-sm">Calculating estimate...</div>
              ) : calculation ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Estimated Repair Cost</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white tracking-tight">
                        {formatINR(calculation.estimatedCost)}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold">Taxes Included</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-navy-950/60 p-3.5 rounded-xl border border-white/5 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Estimated Time</span>
                      <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> ~{calculation.estimatedMinutes} Mins
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Warranty</span>
                      <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> {calculation.warrantyDays} Days
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Inventory Status</span>
                    <span className="text-emerald-400">{calculation.stockBadge}</span>
                  </div>

                  {/* Mandated Disclaimer */}
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{calculation.disclaimer}</span>
                  </div>

                  <button
                    onClick={() => onBookCalculated({ brand: selectedBrand, model: selectedModel, service_name: calculation.service_name, quality })}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 hover:scale-[1.02] transition-all"
                  >
                    <span>Book Repair at {formatINR(calculation.estimatedCost)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
