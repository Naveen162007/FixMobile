import React from 'react';
import { Smartphone, Wrench, ShieldCheck, Truck, Clock, Star, ArrowRight, CheckCircle2, Zap, Cpu, Users, Award, MapPin, Phone, Mail } from 'lucide-react';

export default function Home({ shopDetails, services = [], reviews = [], onStartBooking, onOpenAi }) {
  const shop = shopDetails || {
    name: "FixMobile Repair & Service Hub",
    phone: "+91 98765 43210",
    email: "support@fixmobile.com",
    address: "104, Tech Park Road, Near Central Mall, Sector 4",
    workingHours: "Mon - Sat: 9:30 AM - 8:30 PM | Sun: 10:00 AM - 4:00 PM"
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* -------------------------------------------------------------
          HERO SECTION
      ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100/60 via-white to-slate-50 pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-sky-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-800 text-xs sm:text-sm font-semibold shadow-2xs">
              <Zap className="w-4 h-4 text-brand-600" />
              <span>Fastest Mobile Repair in Town • 6-Month Warranty</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Fix Your Smartphone <br className="hidden sm:block" />
              <span className="gradient-text">Fast, Easy & Trusted.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
              Screen replacements, battery swaps, liquid damage restoration and motherboard chip-level repair. Doorstep service or free pickup & delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartBooking}
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-pastel flex items-center justify-center gap-2 group transition-all"
              >
                <span>Book a Repair Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAi}
                className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white hover:bg-sky-50 text-brand-700 border border-brand-200 font-bold text-base flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Cpu className="w-5 h-5 text-brand-600" />
                <span>AI Repair Assistant</span>
              </button>
            </div>

            {/* Quick Stats Badges */}
            <div className="pt-6 border-t border-sky-100 grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-extrabold text-slate-900">10k+</p>
                <p className="text-xs text-slate-500">Repairs Done</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">45 Mins</p>
                <p className="text-xs text-slate-500">Avg Repair Time</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">4.9 ★</p>
                <p className="text-xs text-slate-500">Google Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative">
            <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-pastel border border-sky-100 space-y-6 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Genuine OEM Parts</h3>
                    <p className="text-xs text-slate-500">100% Guaranteed Quality</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Certified
                </span>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                  <span className="font-medium text-slate-700">Display & Touch Screen</span>
                  <span className="font-extrabold text-brand-700">From ₹2,499</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                  <span className="font-medium text-slate-700">High-Capacity Battery</span>
                  <span className="font-extrabold text-brand-700">From ₹1,299</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                  <span className="font-medium text-slate-700">Ultrasonic Water De-oxidation</span>
                  <span className="font-extrabold text-brand-700">From ₹1,499</span>
                </div>
              </div>

              <button
                onClick={onStartBooking}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
              >
                Start Step-by-Step Booking
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------------------------------------------------
          POPULAR REPAIR SERVICES GRID
      ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Popular Mobile <span className="gradient-text">Repair Categories</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Select a service category below to view estimated costs and schedule a technician.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              onClick={onStartBooking}
              className="group bg-white rounded-3xl p-6 border border-sky-100 hover:border-brand-300 shadow-soft hover:shadow-pastel transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Wrench className="w-6 h-6" />
                  </div>
                  {srv.popular && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      Most Booked
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-600 transition-colors">
                  {srv.category}
                </h3>
                <p className="text-slate-500 text-xs mb-4 leading-relaxed">{srv.label}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Repair Price</span>
                  <span className="text-base font-extrabold text-brand-700">₹{srv.basePartCost + srv.labourCost}</span>
                </div>
                <span className="text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          WHY CHOOSE US SECTION
      ------------------------------------------------------------- */}
      <section className="bg-gradient-to-r from-sky-50 via-white to-blue-50/60 py-16 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
              Why FixMobile
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Built on Trust, Speed & Quality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Genuine OEM Spare Parts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We only use 100% original manufacturer displays, batteries, and components with full quality guarantee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Experienced Technicians</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our technicians are certified level-3 chip micro-soldering experts with over 8 years of phone repair experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Doorstep & Pickup Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose between doorstep repair at your home/office or free pickup & delivery service across the city.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          CUSTOMER REVIEWS CAROUSEL/GRID
      ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 block font-bold">{rev.name}</strong>
                  <span className="text-slate-500 text-[10px]">{rev.device} Repair</span>
                </div>
                <span className="text-slate-400 text-[10px]">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------
          DYNAMIC BACKEND SHOP INFO & LOCATION
      ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold uppercase tracking-wider">
              Live Shop Details
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">{shop.name}</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{shop.tagline}</p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span>{shop.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span>{shop.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span>{shop.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span>{shop.workingHours}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4 text-center">
            <h4 className="font-bold text-lg text-white">Need Urgent Mobile Fix?</h4>
            <p className="text-xs text-slate-300">
              Book online in 60 seconds or call our central repair hotline directly.
            </p>
            <button
              onClick={onStartBooking}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-md transition-all"
            >
              Book Repair Online
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
