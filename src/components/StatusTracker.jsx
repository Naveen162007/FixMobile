import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, AlertTriangle, UserCheck, Wrench, ShieldAlert, DollarSign, Check, X, FileText } from 'lucide-react';
import { api } from '../utils/api';

const STATUS_STAGES = [
  { key: 'Booked', label: 'Booked', desc: 'Repair request logged' },
  { key: 'Picked Up', label: 'Picked Up', desc: 'Device received/picked up' },
  { key: 'Diagnosing', label: 'Diagnosing', desc: 'Tech inspecting device' },
  { key: 'Repairing', label: 'Repairing', desc: 'Parts being installed' },
  { key: 'Quality Check', label: 'Quality Check', desc: 'Testing touch, battery & display' },
  { key: 'Ready', label: 'Ready', desc: 'Ready for store pickup/delivery' },
  { key: 'Delivered', label: 'Delivered', desc: 'Device returned & job closed' }
];

export default function StatusTracker({ initialBookingId = '', onOpenInvoice }) {
  const [searchId, setSearchId] = useState(initialBookingId);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleSearch = async (idToSearch) => {
    const id = idToSearch || searchId;
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.getBookingById(id.trim());
      setBooking(res);
    } catch (err) {
      setError('No repair booking found with ID: ' + id);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialBookingId) {
      handleSearch(initialBookingId);
    }
  }, [initialBookingId]);

  const getCurrentStepIndex = () => {
    if (!booking) return 0;
    const idx = STATUS_STAGES.findIndex(s => s.key === booking.status);
    return idx === -1 ? 0 : idx;
  };

  const handleExtraCostAction = async (action) => {
    if (!booking) return;
    setActionLoading(true);
    try {
      const res = await api.respondExtraCost(booking.bookingId, action);
      if (res.success) {
        setBooking(res.booking);
      }
    } catch (err) {
      alert('Error updating extra cost status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const currentIdx = getCurrentStepIndex();

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6">
      
      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pastel border border-sky-100">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
            Live Repair Tracker
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Track Mobile <span className="gradient-text">Repair Status</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Enter your unique Booking ID (e.g. MRB10245) to check live technician progress.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter Booking ID (e.g. MRB10245)"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 uppercase font-semibold"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-200 transition-all"
            >
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-semibold pt-1">{error}</p>
          )}
        </div>
      </div>

      {/* Booking Details & Status Timeline */}
      {booking && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pastel border border-sky-100 space-y-8 animate-fade-in">
          
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-extrabold text-slate-900">{booking.bookingId}</h3>
                <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {booking.brand} {booking.model} • {booking.category}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenInvoice(booking)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-brand-600" />
                <span>View Invoice</span>
              </button>
            </div>
          </div>

          {/* -------------------------------------------------------------
              EXTRA COST REQUEST APPROVAL ALERT CARD
          ------------------------------------------------------------- */}
          {booking.additionalCostRequest && (
            <div className={`p-6 rounded-2xl border ${
              booking.additionalCostRequest.status === 'Approved'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : booking.additionalCostRequest.status === 'Rejected'
                  ? 'bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-amber-50 border-amber-300 text-amber-900 shadow-md'
            }`}>
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-bold text-sm sm:text-base">
                      Technician Diagnostic Finding: Additional Cost Required
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      booking.additionalCostRequest.status === 'Approved' ? 'bg-emerald-200 text-emerald-800' :
                      booking.additionalCostRequest.status === 'Rejected' ? 'bg-rose-200 text-rose-800' :
                      'bg-amber-200 text-amber-900 animate-pulse'
                    }`}>
                      Status: {booking.additionalCostRequest.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                    <strong>Reason:</strong> {booking.additionalCostRequest.reason}
                  </p>
                  
                  <p className="text-sm font-extrabold text-brand-700 mt-2">
                    Additional Amount: +₹{booking.additionalCostRequest.amount}
                  </p>

                  {booking.additionalCostRequest.status === 'Pending' && (
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => handleExtraCostAction('approve')}
                        disabled={actionLoading}
                        className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Extra Cost (+₹{booking.additionalCostRequest.amount})</span>
                      </button>
                      <button
                        onClick={() => handleExtraCostAction('reject')}
                        disabled={actionLoading}
                        className="py-2.5 px-5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline Extra Cost</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 7-STAGE PROGRESS TIMELINE */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-xs mb-6">
              Live Stage Progress Timeline
            </h4>

            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-0">
                <div 
                  className="h-full bg-gradient-to-r from-brand-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${(currentIdx / (STATUS_STAGES.length - 1)) * 100}%` }}
                />
              </div>

              {/* Stage Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 relative z-10">
                {STATUS_STAGES.map((stage, idx) => {
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stage.key} className="flex sm:flex-col items-center sm:text-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : isCurrent
                            ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div>
                        <p className={`text-xs font-bold ${isCurrent ? 'text-brand-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {stage.label}
                        </p>
                        <p className="text-[10px] text-slate-500 sm:block hidden">{stage.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Technician & Diagnosis Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs sm:text-sm">
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h5 className="font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-600" />
                <span>Assigned Technician</span>
              </h5>
              <p><strong>Name:</strong> {booking.techName || 'Unassigned'}</p>
              <p><strong>Service Mode:</strong> {booking.serviceMethod}</p>
              <p><strong>Slot:</strong> {booking.date} ({typeof booking.timeSlot === 'string' ? booking.timeSlot : (booking.timeSlot?.slot || 'Standard Slot')})</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h5 className="font-bold text-slate-800 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-brand-600" />
                <span>Technician Diagnostic Notes</span>
              </h5>
              <p className="text-slate-600 italic">
                {booking.diagnosticNotes || 'Technician is conducting initial diagnostics.'}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
