import React from 'react';
import { Smartphone, Search, Calculator, Sparkles, ShieldCheck, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HeroSection({ onNavigate, onOpenAIDiagnosis }) {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 border-b border-white/5">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyanAccent text-xs font-semibold tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Coimbatore's #1 Certified Tech Repair Studio</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Phone. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                Our Care.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Fast, reliable and hassle-free mobile repair services in Coimbatore. Get doorstep pickup or express 45-minute repair at our Gandhipuram hub.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group"
              >
                <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Book a Repair</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('tracking')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-navy-800/80 hover:bg-navy-700 text-slate-100 font-bold text-base border border-white/10 hover:border-blue-500/40 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-cyanAccent" />
                <span>Track Repair</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>90-Day Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-cyanAccent flex-shrink-0" />
                <span>45-Min Express</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Original Parts</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Animated Phone Repair Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 sm:w-80 h-[480px] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-2xl shadow-blue-900/40 glow-blue animate-float">
              
              {/* Phone Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
              </div>

              {/* Display Screen */}
              <div className="w-full h-full bg-navy-900 rounded-[36px] overflow-hidden relative flex flex-col justify-between p-5 border border-white/10">
                
                {/* Visual Repair Graphic Overlay */}
                <div className="pt-8 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyanAccent">Kovai Tech Inspection</span>
                    <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">LIVE STATUS</span>
                  </div>

                  {/* Animated Crack Transformation */}
                  <div className="relative h-44 bg-navy-800 rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/20"></div>

                    {/* Animated Scanning Line */}
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan shadow-[0_0_15px_#38BDF8]"></div>

                    <Smartphone className="w-16 h-16 text-cyanAccent relative z-10 animate-pulse" />
                    
                    <div className="mt-3 relative z-10 text-center">
                      <p className="text-xs font-bold text-white">Shattered Display Repair</p>
                      <p className="text-[10px] text-cyan-300 font-mono">Calibrating OLED Panel...</p>
                    </div>
                  </div>

                  {/* Micro Diagnostics Indicator */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between bg-navy-950/60 p-2 rounded-lg border border-white/5">
                      <span className="text-slate-400">Battery Health</span>
                      <span className="text-emerald-400 font-semibold">100% (New Cell)</span>
                    </div>
                    <div className="flex items-center justify-between bg-navy-950/60 p-2 rounded-lg border border-white/5">
                      <span className="text-slate-400">Coimbatore Hub</span>
                      <span className="text-cyanAccent font-semibold">Gandhipuram Main</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Card */}
                <div className="bg-blue-600/20 border border-blue-500/30 p-3 rounded-xl text-center">
                  <span className="text-[11px] font-bold text-cyan-200">⚡ Average Turnaround: 35 Minutes</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Action Navigation Bar */}
        <div className="mt-16 bg-navy-800/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <button
              onClick={() => onNavigate('booking')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/80 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/40 transition-all text-left group"
            >
              <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Book a Repair</p>
                <p className="text-[11px] text-slate-400">Step-by-step wizard</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/80 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/40 transition-all text-left group"
            >
              <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Track Repair</p>
                <p className="text-[11px] text-slate-400">Live 8-stage progress</p>
              </div>
            </button>

            <a
              href="#cost-calculator"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/80 hover:bg-emerald-600/20 border border-white/5 hover:border-emerald-500/40 transition-all text-left group"
            >
              <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Check Repair Cost</p>
                <p className="text-[11px] text-slate-400">Instant price estimate</p>
              </div>
            </a>

            <button
              onClick={onOpenAIDiagnosis}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-navy-900/80 hover:bg-amber-600/20 border border-white/5 hover:border-amber-500/40 transition-all text-left group"
            >
              <div className="p-2.5 rounded-lg bg-amber-600/20 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-300">Diagnose My Phone</p>
                <p className="text-[11px] text-slate-400">AI Symptom check</p>
              </div>
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}
