import React, { useState } from 'react';
import { Smartphone, Search, MapPin, Wrench, Shield, User, Menu, X, Sparkles, PhoneCall } from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, currentUser, onOpenAIDiagnosis }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (tab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-cyanAccent group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Kovai Repair<span className="text-cyanAccent">Hub</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Gandhipuram, Coimbatore
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button 
              onClick={() => navigate('home')} 
              className={`hover:text-cyanAccent transition-colors ${currentTab === 'home' ? 'text-cyanAccent font-semibold' : ''}`}
            >
              Home
            </button>

            <a 
              href="#services-section" 
              onClick={() => { if(currentTab !== 'home') navigate('home'); }} 
              className="hover:text-cyanAccent transition-colors"
            >
              Services
            </a>

            <button 
              onClick={onOpenAIDiagnosis}
              className="hover:text-cyanAccent transition-colors flex items-center gap-1.5 text-amber-300 font-semibold"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI Diagnosis
            </button>

            <a 
              href="#cost-calculator" 
              onClick={() => { if(currentTab !== 'home') navigate('home'); }}
              className="hover:text-cyanAccent transition-colors"
            >
              Cost Calculator
            </a>

            <a 
              href="#coimbatore-map" 
              onClick={() => { if(currentTab !== 'home') navigate('home'); }}
              className="hover:text-cyanAccent transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Location
            </a>

            <button 
              onClick={() => navigate('faq')} 
              className={`hover:text-cyanAccent transition-colors ${currentTab === 'faq' ? 'text-cyanAccent font-semibold' : ''}`}
            >
              FAQ
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate('tracking')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-cyanAccent" />
              <span>Track Repair</span>
            </button>

            {currentUser?.role === 'admin' ? (
              <button
                onClick={() => navigate('admin-dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-900/30"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            ) : currentUser?.role === 'technician' ? (
              <button
                onClick={() => navigate('tech-dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-900/30"
              >
                <Wrench className="w-4 h-4" />
                <span>Tech Station</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('booking')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-all"
              >
                <Smartphone className="w-4 h-4" />
                <span>Book a Repair</span>
              </button>
            )}

            {currentUser && currentUser.role === 'customer' && (
              <button
                onClick={() => navigate('customer-dashboard')}
                className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
                title="Customer Account"
              >
                <User className="w-4 h-4 text-cyanAccent" />
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-navy-800 border border-white/10 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900 border-b border-white/10 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            <button
              onClick={() => navigate('booking')}
              className="w-full py-2.5 px-3 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/40"
            >
              <Smartphone className="w-4 h-4" /> Book Repair
            </button>
            <button
              onClick={() => navigate('tracking')}
              className="w-full py-2.5 px-3 rounded-lg bg-navy-800 border border-white/10 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-cyanAccent" /> Track Repair
            </button>
          </div>

          <div className="space-y-2 text-sm font-medium text-slate-300">
            <button onClick={() => navigate('home')} className="block w-full text-left py-2 hover:text-cyanAccent">Home</button>
            <button onClick={onOpenAIDiagnosis} className="block w-full text-left py-2 text-amber-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI Phone Diagnosis
            </button>
            <button onClick={() => navigate('faq')} className="block w-full text-left py-2 hover:text-cyanAccent">FAQ</button>
            {currentUser?.role === 'customer' && (
              <button onClick={() => navigate('customer-dashboard')} className="block w-full text-left py-2 text-cyanAccent font-semibold">My Account & Bookings</button>
            )}
            {currentUser?.role === 'technician' && (
              <button onClick={() => navigate('tech-dashboard')} className="block w-full text-left py-2 text-cyanAccent font-semibold">Technician Workstation</button>
            )}
            {currentUser?.role === 'admin' && (
              <button onClick={() => navigate('admin-dashboard')} className="block w-full text-left py-2 text-purple-400 font-semibold">Admin Dashboard</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
