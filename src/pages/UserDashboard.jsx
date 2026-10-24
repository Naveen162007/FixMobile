import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Clock, FileText, ShieldCheck, Bell, HelpCircle, User, Wrench, Search, ChevronRight, CheckCircle2, DollarSign } from 'lucide-react';
import { api } from '../utils/api';
import StatusTracker from '../components/StatusTracker';
import CustomerQueries from '../components/CustomerQueries';

export default function UserDashboard({ user, onOpenInvoice, onOpenNotifications, onStartBooking }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, tracking, invoices, warranty, queries, notifications, profile
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookingForTrack, setSelectedBookingForTrack] = useState('');

  const loadUserBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getBookings({ userId: user.id });
      setBookings(data);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserBookings();
  }, [user]);

  const activeRepair = bookings.find(b => !['Delivered', 'Cancelled'].includes(b.status));
  const completedRepairs = bookings.filter(b => b.status === 'Delivered');
  const totalSpent = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'Paid' ? (b.finalCost || b.totalCost) : 0), 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Clock },
    { id: 'tracking', label: 'Repair Tracking', icon: Wrench },
    { id: 'invoices', label: 'Invoices & Payments', icon: FileText },
    { id: 'warranty', label: 'Warranty Certificates', icon: ShieldCheck },
    { id: 'queries', label: 'My Queries', icon: HelpCircle },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
      
      {/* Dashboard Top User Header Card */}
      <div className="bg-gradient-to-r from-brand-600 via-sky-600 to-brand-700 rounded-3xl p-6 sm:p-8 text-white shadow-pastel mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center font-extrabold text-2xl border border-white/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">Customer Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {user?.name || 'Customer'}!</h1>
            <p className="text-xs text-sky-100">{user?.email} • {user?.phone || 'No phone registered'}</p>
          </div>
        </div>

        <button
          onClick={onStartBooking}
          className="py-3 px-6 rounded-2xl bg-white hover:bg-sky-50 text-brand-700 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
        >
          <Wrench className="w-4 h-4 text-brand-600" />
          <span>Book New Repair</span>
        </button>
      </div>

      {/* Tabs Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Navigation Sidebar */}
        <div className="bg-white rounded-3xl p-4 shadow-pastel border border-sky-100 h-fit space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full p-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-sky-50/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-600'}`} />
                  <span>{t.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Tab Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* -------------------------------------------------------------
              TAB 1: OVERVIEW
          ------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Bookings</span>
                  <p className="text-3xl font-extrabold text-slate-900">{bookings.length}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Repair</span>
                  <p className="text-3xl font-extrabold text-brand-600">{activeRepair ? 1 : 0}</p>
                  <p className="text-xs text-slate-500 mt-1">{activeRepair ? activeRepair.bookingId : 'No active repairs'}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-soft">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Spent</span>
                  <p className="text-3xl font-extrabold text-emerald-600">₹{totalSpent}</p>
                </div>
              </div>

              {/* Active Repair Card Banner */}
              {activeRepair && (
                <div className="bg-gradient-to-r from-sky-50 to-brand-50 p-6 rounded-3xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold uppercase">
                      Active Repair in Progress
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      {activeRepair.brand} {activeRepair.model} ({activeRepair.category})
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Booking ID: <strong>{activeRepair.bookingId}</strong> • Status: <strong className="text-brand-700">{activeRepair.status}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBookingForTrack(activeRepair.bookingId);
                      setActiveTab('tracking');
                    }}
                    className="py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Track Progress
                  </button>
                </div>
              )}

              {/* Recent Bookings List */}
              <div className="bg-white rounded-3xl p-6 shadow-pastel border border-sky-100 space-y-4">
                <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                  Recent Repair Bookings
                </h3>

                {bookings.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No bookings logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.bookingId} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{b.bookingId} — {b.brand} {b.model}</p>
                          <p className="text-slate-500">{b.category} • {b.date}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-brand-100 text-brand-800 font-bold">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 2: MY BOOKINGS
          ------------------------------------------------------------- */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl p-6 shadow-pastel border border-sky-100 space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                All My Bookings ({bookings.length})
              </h3>

              {bookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No repair bookings logged.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.bookingId} className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs sm:text-sm">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-slate-900 text-base">{b.bookingId}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-xs font-bold">
                            {b.status}
                          </span>
                        </div>
                        <p className="text-slate-700 font-medium">{b.brand} {b.model} — {b.category}</p>
                        <p className="text-slate-500 text-xs mt-0.5">Scheduled Date: {b.date} ({typeof b.timeSlot === 'string' ? b.timeSlot : (b.timeSlot?.slot || 'Standard Slot')}) • {b.serviceMethod}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBookingForTrack(b.bookingId);
                            setActiveTab('tracking');
                          }}
                          className="py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs"
                        >
                          Track
                        </button>
                        <button
                          onClick={() => onOpenInvoice(b)}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 3: REPAIR TRACKING
          ------------------------------------------------------------- */}
          {activeTab === 'tracking' && (
            <div className="animate-fade-in">
              <StatusTracker 
                initialBookingId={selectedBookingForTrack || (bookings[0]?.bookingId || '')} 
                onOpenInvoice={onOpenInvoice} 
              />
            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 4: INVOICES & PAYMENTS
          ------------------------------------------------------------- */}
          {activeTab === 'invoices' && (
            <div className="bg-white rounded-3xl p-6 shadow-pastel border border-sky-100 space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Invoices & Payment Records
              </h3>

              {bookings.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No invoice records found.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.bookingId} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                      <div>
                        <p className="font-bold text-slate-900">INV-{b.bookingId}</p>
                        <p className="text-slate-500">{b.brand} {b.model} • {b.date}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-extrabold text-brand-700 text-base">₹{b.finalCost || b.totalCost}</p>
                          <span className="text-[10px] text-emerald-600 font-bold uppercase">{b.paymentStatus || 'Paid'}</span>
                        </div>
                        <button
                          onClick={() => onOpenInvoice(b)}
                          className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
                        >
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 5: WARRANTY CERTIFICATES
          ------------------------------------------------------------- */}
          {activeTab === 'warranty' && (
            <div className="bg-white rounded-3xl p-6 shadow-pastel border border-sky-100 space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                My Active Warranty Certificates
              </h3>

              <div className="space-y-4">
                {bookings.filter(b => b.status === 'Delivered').map((b) => (
                  <div key={b.bookingId} className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="font-extrabold text-slate-900 text-sm">6-Month Warranty Certificate</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
                    </div>

                    <p className="text-slate-700"><strong>Device:</strong> {b.brand} {b.model}</p>
                    <p className="text-slate-700"><strong>Covered Repair:</strong> {b.category}</p>
                    <p className="text-slate-500 text-[11px]">Valid for 180 days from completion date.</p>
                  </div>
                ))}

                {bookings.filter(b => b.status === 'Delivered').length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No completed repairs eligible for warranty certificates yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 6: MY QUERIES
          ------------------------------------------------------------- */}
          {activeTab === 'queries' && (
            <div className="animate-fade-in">
              <CustomerQueries user={user} />
            </div>
          )}

          {/* -------------------------------------------------------------
              TAB 7: MY PROFILE
          ------------------------------------------------------------- */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 shadow-pastel border border-sky-100 space-y-4 animate-fade-in">
              <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
                Customer Profile Details
              </h3>

              <div className="space-y-4 max-w-md text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Full Name</label>
                  <p className="font-bold text-slate-900 text-base">{user?.name}</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Email Address</label>
                  <p className="font-bold text-slate-900">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Phone Number</label>
                  <p className="font-bold text-slate-900">{user?.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Default Address</label>
                  <p className="font-bold text-slate-900">{user?.address || 'No address saved'}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
