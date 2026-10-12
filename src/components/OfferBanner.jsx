import React from 'react';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';

export default function OfferBanner({ onBookNow }) {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-4 py-3 shadow-lg glow-amber relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5 font-extrabold text-sm sm:text-base tracking-tight">
          <span className="p-1.5 rounded-lg bg-navy-950/20 text-slate-950">
            <Tag className="w-4 h-4 animate-bounce" />
          </span>
          <span>🎉 First Repair? Get <span className="underline decoration-slate-950 decoration-2 font-black">10% OFF</span> Automatically at Checkout!</span>
          <span className="hidden lg:inline-block text-xs bg-navy-950 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold ml-2">
            Use Code: NEW10
          </span>
        </div>

        <button
          onClick={onBookNow}
          className="px-4 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
        >
          <span>Claim 10% Discount</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
