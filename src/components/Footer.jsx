import React from 'react';
import { Smartphone, MapPin, Phone, Mail, Clock, ShieldCheck, Truck, Wrench } from 'lucide-react';

export default function Footer({ shopDetails, setActiveTab }) {
  const shop = shopDetails || {
    name: "FixMobile Repair & Service Hub",
    phone: "+91 98765 43210",
    email: "support@fixmobile.com",
    address: "104, Tech Park Road, Near Central Mall, Sector 4",
    workingHours: "Mon - Sat: 9:30 AM - 8:30 PM | Sun: 10:00 AM - 4:00 PM"
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Fix<span className="text-brand-400">Mobile</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Professional, fast, and transparent mobile repair services. Doorstep service, free pickup & delivery, and genuine spare parts with 6-month warranty.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Technicians & Genuine Components</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
              Quick Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => setActiveTab('book')} className="hover:text-brand-400 transition-colors">
                  Screen & OLED Replacement
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('book')} className="hover:text-brand-400 transition-colors">
                  High-Capacity Battery Swap
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('book')} className="hover:text-brand-400 transition-colors">
                  Water Damage De-oxidation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('book')} className="hover:text-brand-400 transition-colors">
                  Charging Port & Speaker Fix
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai')} className="hover:text-brand-400 transition-colors flex items-center gap-1">
                  <span>AI Repair Assistant</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Service Options */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
              Service Methods
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Free Pickup & Delivery</strong>
                  <p className="text-slate-400 text-xs">We pick up your phone, fix it at our lab, and deliver back.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Wrench className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Doorstep Technician Repair</strong>
                  <p className="text-slate-400 text-xs">Certified tech repairs your phone right at your home or office.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details (Dynamic from Backend) */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2">
              Shop Contact Details
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                <span>{shop.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{shop.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{shop.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                <span>{shop.workingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 {shop.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Repair</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
