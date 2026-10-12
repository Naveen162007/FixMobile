import React from 'react';
import { User, ShieldCheck, Wrench, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RoleSelector({ onSelectRole, currentRole }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50/50 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Header Badge */}
      <div className="text-center max-w-2xl mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-700 text-xs sm:text-sm font-medium mb-4 shadow-sm">
          <Smartphone className="w-4 h-4 text-brand-600" />
          <span>FixMobile Repair Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Select Your <span className="gradient-text">Role to Continue</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Welcome to FixMobile. Please choose how you would like to access the portal. Customer and Shop Owner portals are completely separated.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Customer Card */}
        <div 
          onClick={() => onSelectRole('user')}
          className="group relative bg-white border border-sky-100 hover:border-brand-400 rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-pastel transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          
          <div>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
              <User className="w-7 h-7" />
            </div>

            <div className="inline-block px-2.5 py-1 rounded bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-2">
              Customer Portal
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-brand-600 transition-colors">
              User / Customer
            </h2>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Book mobile repairs, choose doorstep or shop pickup, track live repair status, consult AI diagnostic assistant & view invoices.
            </p>

            <ul className="space-y-2 mb-8 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Instant Cost Breakdown & Slot Picker</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Live 7-Stage Repair Tracker</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>AI Repair Assistant & Query Support</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm flex items-center justify-center gap-2 group-hover:bg-brand-600 transition-colors shadow-sm">
            <span>Enter Customer Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Admin Card */}
        <div 
          onClick={() => onSelectRole('admin')}
          className="group relative bg-white border border-sky-100 hover:border-sky-400 rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-pastel transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

          <div>
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="inline-block px-2.5 py-1 rounded bg-sky-50 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-2">
              Admin & Owner Portal
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-700 transition-colors">
              Admin / Shop Owner
            </h2>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Secure dashboard to manage repair bookings, technician assignments, inventory stock alerts, shop details & customer queries.
            </p>

            <ul className="space-y-2 mb-8 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Full Bookings & Repair Workflow Control</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Spare Parts Inventory & Low Stock Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>Live Shop Details & Pricing Management</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 px-4 rounded-xl bg-slate-900 text-white font-medium text-sm flex items-center justify-center gap-2 group-hover:bg-sky-700 transition-colors shadow-sm">
            <span>Admin Secure Login</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div className="mt-8 text-slate-500 text-xs text-center">
        FixMobile Platform • Pure White & Pastel Light-Blue Theme • Secured Authentication
      </div>
    </div>
  );
}
