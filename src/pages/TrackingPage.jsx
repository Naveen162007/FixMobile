import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, Wrench, Shield, FileText, Phone, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR, getStatusBadgeClass } from '../utils/formatters';

export default function TrackingPage({ initialBookingId, onNavigate, onViewInvoice }) {
  const [bookingId, setBookingId] = useState(initialBookingId || 'MRB-2026-10245');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi(`/tracking/${idToFetch.trim()}`);
      setData(res);
    } catch (err) {
      setError(err.message || 'Booking ID not found. Try MRB-2026-10245.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchTracking(bookingId);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(bookingId);
  };

  return (
    <div className="py-12 bg-navy-900 min-h-screen text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Search Bar */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyanAccent text-xs font-semibold">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Repair Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Track Your Mobile Repair</h1>
          <p className="text-xs sm:text-sm text-slate-300">Enter your Booking ID to view 8-stage repair progress & check-in photos.</p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="e.g. MRB-2026-10245"
              className="flex-1 bg-navy-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-cyanAccent outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/40"
            >
              Track Status
            </button>
          </form>
        </div>

        {loading && (
          <div className="py-12 text-center text-slate-400 text-sm">Fetching tracking status from database...</div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs font-semibold text-center max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 mx-auto mb-1 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {data && data.booking && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Booking Summary Box */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-white">{data.booking.brand} {data.booking.model}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(data.booking.status)}`}>
                      {data.booking.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">Booking ID: <strong className="text-cyanAccent font-mono">{data.booking.id}</strong></span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Final Amount</span>
                  <span className="text-2xl font-extrabold text-cyanAccent">{formatINR(data.booking.final_amount)}</span>
                </div>
              </div>

              {/* Progress Percentage Visual Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Repair Progress</span>
                  <span className="text-cyanAccent font-mono">{data.booking.progress_percent}%</span>
                </div>

                <div className="w-full bg-navy-950 h-3.5 rounded-full p-0.5 border border-white/10">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700 glow-blue"
                    style={{ width: `${data.booking.progress_percent}%` }}
                  ></div>
                </div>
              </div>

              {/* Info Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-navy-950/60 p-4 rounded-2xl border border-white/5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Service Name</span>
                  <span className="font-bold text-white">{data.booking.service_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Delivery Type</span>
                  <span className="font-bold text-white">{data.booking.service_type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Technician</span>
                  <span className="font-bold text-cyan-300">{data.booking.technician_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Payment Status</span>
                  <span className={`font-bold ${data.booking.payment_status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {data.booking.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual 8-Stage Repair Timeline */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-white">8-Stage Repair Timeline</h3>

              <div className="relative border-l-2 border-white/10 ml-4 space-y-6 pl-6">
                {data.steps.map((step, idx) => {
                  const isCompleted = data.booking.progress_percent >= step.minPercent;
                  const isCurrent = idx === data.currentStepIndex;

                  return (
                    <div key={idx} className="relative">
                      {/* Timeline Bullet Node */}
                      <div className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-blue-600 border-cyanAccent shadow-[0_0_10px_#38BDF8]'
                          : 'bg-navy-900 border-slate-700'
                      }`}>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>

                      <div>
                        <span className={`text-sm font-extrabold block ${
                          isCurrent ? 'text-cyanAccent' : isCompleted ? 'text-white' : 'text-slate-500'
                        }`}>
                          {step.title} {isCurrent && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full ml-2 font-mono">CURRENT STAGE</span>}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Digital Device Check-in Inspection Card */}
            {data.checkin && (
              <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyanAccent" /> Digital Device Check-in Record
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-navy-950/60 p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-slate-400 block font-medium">Screen Condition</span>
                    <span className="font-bold text-slate-200">{data.checkin.screen_condition}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Body / Frame</span>
                    <span className="font-bold text-slate-200">{data.checkin.body_condition}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Device IMEI</span>
                    <span className="font-mono text-cyan-300 font-bold">{data.checkin.imei || 'Not recorded'}</span>
                  </div>
                </div>

                {/* Pre / Post Photos */}
                {(data.checkin.before_photo || data.checkin.after_photo) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {data.checkin.before_photo && (
                      <div>
                        <span className="text-[11px] text-slate-400 font-bold block mb-1">Check-in Photo (Before)</span>
                        <img src={data.checkin.before_photo} alt="Before" className="w-full h-44 object-cover rounded-xl border border-white/10" />
                      </div>
                    )}
                    {data.checkin.after_photo && (
                      <div>
                        <span className="text-[11px] text-emerald-400 font-bold block mb-1">Repaired Photo (After)</span>
                        <img src={data.checkin.after_photo} alt="After" className="w-full h-44 object-cover rounded-xl border border-emerald-500/30 glow-blue" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => onViewInvoice(data.booking.id)}
                className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>View & Print Digital Invoice</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-3.5 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs"
              >
                Return to Home
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
