import React, { useState } from 'react';
import { Smartphone, Wrench, Search, User, LogOut, Bell, ShieldCheck, Cpu, HelpCircle, LayoutDashboard, RefreshCw } from 'lucide-react';

export default function Header({ 
  role, 
  user, 
  onSwitchRole, 
  onOpenAuth, 
  onLogout, 
  activeTab, 
  setActiveTab,
  shopDetails,
  notifications = [],
  onOpenNotifications
}) {
  const [userDropdown, setUserDropdown] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
      {/* Top Shop Announcement Bar */}
      {shopDetails?.announcement && (
        <div className="bg-gradient-to-r from-brand-600 to-sky-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <span>{shopDetails.announcement}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-200">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Fix<span className="text-brand-600">Mobile</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-wider text-sky-600 -mt-1">
                Repair & Service Hub
              </span>
            </div>
          </div>

          {/* Navigation Links for Customer Portal */}
          {role === 'user' && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
              <button 
                onClick={() => setActiveTab('home')} 
                className={`px-3.5 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab('book')} 
                className={`px-3.5 py-2 rounded-lg transition-colors ${activeTab === 'book' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                Book a Repair
              </button>
              <button 
                onClick={() => setActiveTab('track')} 
                className={`px-3.5 py-2 rounded-lg transition-colors ${activeTab === 'track' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                Track Repair
              </button>
              <button 
                onClick={() => setActiveTab('ai')} 
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === 'ai' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                <Cpu className="w-4 h-4 text-brand-500" />
                <span>AI Assistant</span>
              </button>
              <button 
                onClick={() => setActiveTab('queries')} 
                className={`px-3.5 py-2 rounded-lg transition-colors ${activeTab === 'queries' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
              >
                Support Tickets
              </button>
              {user && (
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className={`px-3.5 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'}`}
                >
                  My Dashboard
                </button>
              )}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Switcher Pill */}
            <button
              onClick={onSwitchRole}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-all shadow-2xs"
              title="Switch role view"
            >
              <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
              <span>Role: <strong className="capitalize">{role}</strong></span>
            </button>

            {/* Customer Notification Bell */}
            {role === 'user' && user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-full text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                title="Notifications & SMS Log"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </button>
            )}

            {/* Auth / Profile Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs sm:text-sm font-semibold hover:bg-brand-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs sm:text-sm">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-slate-500 text-xs truncate">{user.email}</p>
                    </div>
                    {role === 'user' && (
                      <button
                        onClick={() => { setActiveTab('dashboard'); setUserDropdown(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-600" />
                        My Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => { onLogout(); setUserDropdown(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                Sign In
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
