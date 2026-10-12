import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export default function BeforeAfterShowcase() {
  const [activeTab, setActiveTab] = useState('screen');

  const items = [
    {
      id: 'screen',
      title: 'Screen Replacement',
      device: 'iPhone 14 Pro OLED',
      beforeImg: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      notes: 'Spiderweb cracked display replaced with original Super Retina panel & 90-day Kovai warranty.'
    },
    {
      id: 'body',
      title: 'Back Panel / Body Repair',
      device: 'Samsung Galaxy S23 Ultra',
      beforeImg: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d963?auto=format&fit=crop&w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      notes: 'Shattered rear glass replaced using laser separation. IP68 adhesive seal reinstated.'
    },
    {
      id: 'water',
      title: 'Water Damage Restoration',
      device: 'OnePlus 11R 5G',
      beforeImg: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
      notes: 'Ultrasonic isopropyl bath & power IC capacitor short circuit repair.'
    },
    {
      id: 'camera',
      title: 'Camera Module & Lens Glass',
      device: 'Xiaomi 13 Pro',
      beforeImg: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=600&q=80',
      afterImg: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
      notes: 'Scratched camera glass replaced with sapphire lens cover for sharp 4K focus.'
    }
  ];

  const currentItem = items.find(i => i.id === activeTab) || items[0];

  return (
    <section className="py-16 bg-navy-900/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-900/40 border border-cyan-500/30 text-cyanAccent text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Proven Craftsmanship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Before & After Repair Gallery
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Real photos recorded by our Coimbatore technicians before and after completing repairs.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 scale-105'
                  : 'bg-navy-800 text-slate-300 hover:bg-navy-700 border border-white/5'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{currentItem.title}</h3>
              <span className="text-xs text-cyanAccent font-semibold">{currentItem.device}</span>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Restored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Before Photo */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/40 h-64 shadow-lg group">
                <img
                  src={currentItem.beforeImg}
                  alt="Before Repair"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-md">
                  BEFORE REPAIR
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium text-center">Initial Damaged State</p>
            </div>

            {/* After Photo */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 h-64 shadow-lg group glow-blue">
                <img
                  src={currentItem.afterImg}
                  alt="After Repair"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-lg shadow-md">
                  AFTER REPAIR
                </div>
              </div>
              <p className="text-xs text-emerald-400 font-semibold text-center">Pristine Restored Condition</p>
            </div>

          </div>

          <div className="p-4 rounded-2xl bg-navy-900 border border-white/5 text-xs text-slate-300">
            <strong className="text-white">Technician Inspection Note:</strong> {currentItem.notes}
          </div>

        </div>

      </div>
    </section>
  );
}
