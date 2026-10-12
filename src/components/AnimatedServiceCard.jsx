import React from 'react';
import { Smartphone, BatteryCharging, Zap, Camera, Volume2, Cpu, Droplet, Shield, Wrench, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export default function AnimatedServiceCard({ service, onBookService }) {
  const renderAnimation = (animType) => {
    switch (animType) {
      case 'screen':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-cyan-400/50 transition-colors">
            {/* Cracked mesh overlay */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-0 transition-opacity duration-700 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:6px_6px]"></div>
            <div className="w-10 h-16 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 opacity-20 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        );

      case 'battery':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex flex-col items-center justify-center p-2 group-hover:border-emerald-400/50 transition-colors">
            <div className="w-8 h-12 rounded bg-navy-800 border border-slate-700 relative overflow-hidden flex items-end">
              <div className="w-full bg-emerald-500 transition-all duration-700 group-hover:h-full h-1/4 animate-pulse"></div>
            </div>
            <BatteryCharging className="w-4 h-4 text-emerald-400 mt-1" />
          </div>
        );

      case 'charging':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-blue-400/50 transition-colors">
            <Zap className="w-7 h-7 text-amber-400 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 animate-bounce" />
          </div>
        );

      case 'camera':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-purple-400/50 transition-colors">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500/40 group-hover:border-purple-400 flex items-center justify-center transition-all duration-500">
              <Camera className="w-5 h-5 text-purple-300 blur-[1px] group-hover:blur-0 transition-all duration-500" />
            </div>
          </div>
        );

      case 'speaker':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center gap-1 p-2 group-hover:border-cyan-400/50 transition-colors">
            <div className="w-1 bg-cyan-400 rounded-full h-3 group-hover:h-8 transition-all duration-300"></div>
            <div className="w-1 bg-cyan-400 rounded-full h-6 group-hover:h-12 transition-all duration-500"></div>
            <div className="w-1 bg-cyan-400 rounded-full h-4 group-hover:h-6 transition-all duration-400"></div>
          </div>
        );

      case 'software':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex flex-col items-center justify-center p-1 group-hover:border-indigo-400/50 transition-colors font-mono text-[9px]">
            <span className="text-rose-400 group-hover:hidden animate-pulse">ERROR!</span>
            <span className="text-emerald-400 hidden group-hover:inline">SYS_OK</span>
            <Cpu className="w-5 h-5 text-indigo-400 mt-1" />
          </div>
        );

      case 'water':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-blue-400/50 transition-colors">
            <Droplet className="w-7 h-7 text-blue-400 animate-bounce group-hover:text-cyan-300 transition-colors" />
          </div>
        );

      case 'body':
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-slate-300 transition-colors">
            <Shield className="w-7 h-7 text-slate-400 group-hover:text-amber-400 transition-colors group-hover:rotate-6" />
          </div>
        );

      default:
        return (
          <div className="relative w-14 h-20 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center">
            <Wrench className="w-7 h-7 text-cyanAccent animate-pulse" />
          </div>
        );
    }
  };

  return (
    <div className="group glass-card rounded-2xl p-6 border border-white/10 hover:border-blue-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          {renderAnimation(service.animation_type)}
          
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Starts from</span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              {formatINR(service.base_price)}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyanAccent transition-colors mb-2">
          {service.name}
        </h3>

        <p className="text-xs text-slate-300 font-normal leading-relaxed line-clamp-3 mb-4">
          {service.explanation}
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>~{service.est_minutes} Mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>{service.warranty_days} Days Warranty</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            🟢 Part Available
          </span>

          <button
            onClick={() => onBookService(service)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-900/30 hover:scale-105 transition-all"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
