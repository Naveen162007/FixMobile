import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wrench, Users, UserCheck, Package, DollarSign, Store, MessageSquare, 
  TrendingUp, Settings, Plus, Edit2, Trash2, Search, Filter, AlertTriangle, ShieldCheck, 
  Check, X, FileText, Send, RefreshCw, Smartphone, Clock, Eye, AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';

export default function AdminDashboard({ adminUser, shopDetails, onShopDetailsUpdated, onOpenInvoice }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [queries, setQueries] = useState([]);
  const [shopForm, setShopForm] = useState(shopDetails || {});

  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modal / Form states
  const [extraCostAmt, setExtraCostAmt] = useState('');
  const [extraCostReason, setExtraCostReason] = useState('');
  const [techNotes, setTechNotes] = useState('');

  // New Tech Modal
  const [showTechModal, setShowTechModal] = useState(false);
  const [newTech, setNewTech] = useState({ name: '', phone: '', spec: 'Screen & Glass Expert', status: 'Available' });

  // New Inventory Modal
  const [showInvModal, setShowInvModal] = useState(false);
  const [newInv, setNewInv] = useState({ name: '', brand: 'Apple', model: 'iPhone 13', quantity: 10, reorderLevel: 5, price: 1999, supplier: 'Direct Wholesale' });

  // Reply Query Modal
  const [replyingQuery, setReplyingQuery] = useState(null);
  const [queryReplyText, setQueryReplyText] = useState('');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [aData, bData, cData, tData, iData, qData] = await Promise.all([
        api.getAnalytics(),
        api.getBookings(),
        api.getCustomers(),
        api.getTechnicians(),
        api.getInventory(),
        api.getQueries()
      ]);
      setAnalytics(aData);
      setBookings(bData);
      setCustomers(cData);
      setTechnicians(tData);
      setInventory(iData);
      setQueries(qData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  useEffect(() => {
    if (shopDetails) setShopForm(shopDetails);
  }, [shopDetails]);

  // Shop Details update handler
  const handleSaveShopDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateShopDetails(shopForm);
      if (res.success) {
        onShopDetailsUpdated(res.shopDetails);
        alert('Shop details updated successfully! These changes are now live on the customer website.');
      }
    } catch (err) {
      alert('Failed to update shop details: ' + err.message);
    }
  };

  // Booking updates
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.updateBooking(bookingId, { status: newStatus });
      if (res.success) {
        loadAllAdminData();
        if (selectedBooking && selectedBooking.bookingId === bookingId) {
          setSelectedBooking(res.booking);
        }
      }
    } catch (err) {
      alert('Failed to update booking status: ' + err.message);
    }
  };

  const handleAssignTechnician = async (bookingId, techId) => {
    const tech = technicians.find(t => t.id === techId);
    try {
      const res = await api.updateBooking(bookingId, {
        assignedTechId: techId,
        techName: tech ? tech.name : 'Unassigned'
      });
      if (res.success) {
        loadAllAdminData();
        if (selectedBooking) setSelectedBooking(res.booking);
      }
    } catch (err) {
      alert('Failed to assign technician: ' + err.message);
    }
  };

  const handleSendExtraCost = async (e) => {
    e.preventDefault();
    if (!selectedBooking || !extraCostAmt) return;
    try {
      const res = await api.updateBooking(selectedBooking.bookingId, {
        additionalCost: {
          amount: Number(extraCostAmt),
          reason: extraCostReason || 'Additional component replacement needed'
        }
      });
      if (res.success) {
        setSelectedBooking(res.booking);
        setExtraCostAmt('');
        setExtraCostReason('');
        loadAllAdminData();
        alert('Additional cost request sent to customer dashboard!');
      }
    } catch (err) {
      alert('Failed to send extra cost request: ' + err.message);
    }
  };

  const handleSaveTechNotes = async () => {
    if (!selectedBooking) return;
    try {
      const res = await api.updateBooking(selectedBooking.bookingId, { diagnosticNotes: techNotes });
      if (res.success) {
        setSelectedBooking(res.booking);
        loadAllAdminData();
        alert('Technician notes saved.');
      }
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  };

  // Technician Add & Delete
  const handleAddTechnician = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createTechnician(newTech);
      if (res.success) {
        setShowTechModal(false);
        setNewTech({ name: '', phone: '', spec: 'Screen & Glass Expert', status: 'Available' });
        loadAllAdminData();
      }
    } catch (err) {
      alert('Failed to add technician: ' + err.message);
    }
  };

  const handleDeleteTechnician = async (id) => {
    if (!confirm('Are you sure you want to remove this technician?')) return;
    try {
      await api.deleteTechnician(id);
      loadAllAdminData();
    } catch (err) {
      alert('Failed to delete technician: ' + err.message);
    }
  };

  // Inventory Add & Restock
  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createInventory(newInv);
      if (res.success) {
        setShowInvModal(false);
        setNewInv({ name: '', brand: 'Apple', model: 'iPhone 13', quantity: 10, reorderLevel: 5, price: 1999, supplier: 'Direct Wholesale' });
        loadAllAdminData();
      }
    } catch (err) {
      alert('Failed to add inventory: ' + err.message);
    }
  };

  const handleRestockInventory = async (item, addQty = 10) => {
    try {
      await api.updateInventory(item.id, { quantity: Number(item.quantity) + addQty });
      loadAllAdminData();
    } catch (err) {
      alert('Failed to restock: ' + err.message);
    }
  };

  // Reply Customer Query
  const handleSendQueryReply = async (e) => {
    e.preventDefault();
    if (!replyingQuery || !queryReplyText) return;
    try {
      const res = await api.replyQuery(replyingQuery.queryId, {
        response: queryReplyText,
        status: 'Replied'
      });
      if (res.success) {
        setReplyingQuery(null);
        setQueryReplyText('');
        loadAllAdminData();
      }
    } catch (err) {
      alert('Failed to send query reply: ' + err.message);
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilterStatus === 'All' || b.status === bookingFilterStatus;
    const matchesSearch = !bookingSearch || 
      b.bookingId.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.includes(bookingSearch) ||
      b.brand.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.model.toLowerCase().includes(bookingSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sidebarTabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings Management', icon: Wrench, badge: bookings.filter(b => b.status === 'Booked').length },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'technicians', label: 'Technician Team', icon: UserCheck },
    { id: 'inventory', label: 'Spare Parts Inventory', icon: Package, badge: inventory.filter(i => i.quantity <= i.reorderLevel).length },
    { id: 'payments', label: 'Payments & Invoices', icon: DollarSign },
    { id: 'shop', label: 'Shop Details & Prices', icon: Store },
    { id: 'queries', label: 'Customer Queries', icon: MessageSquare, badge: queries.filter(q => q.status === 'Open').length },
    { id: 'analytics', label: 'Analytics & Reports', icon: TrendingUp },
    { id: 'settings', label: 'Integration Settings', icon: Settings },
  ];

  const metrics = analytics?.metrics || {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'Booked').length,
    activeRepairs: bookings.filter(b => ['Picked Up', 'Diagnosing', 'Repairing', 'Quality Check'].includes(b.status)).length,
    completedRepairs: bookings.filter(b => ['Ready', 'Delivered'].includes(b.status)).length,
    totalCustomers: customers.length,
    revenue: bookings.reduce((sum, b) => sum + (b.finalCost || b.totalCost || 0), 0),
    availableTechs: technicians.filter(t => t.status === 'Available').length,
    lowStockItems: inventory.filter(i => i.quantity <= i.reorderLevel).length
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* -------------------------------------------------------------
          LEFT SIDEBAR NAVIGATION
      ------------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight">FixMobile</span>
              <span className="block text-[10px] uppercase font-bold text-sky-400">Admin Control Panel</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            {sidebarTabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                    <span>{t.label}</span>
                  </div>
                  {t.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-brand-700' : 'bg-rose-500 text-white'
                    }`}>
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 px-3">
          <p>Logged in as: <strong className="text-slate-300">{adminUser?.name || 'Admin'}</strong></p>
          <p className="text-[10px]">FixMobile v2.0 • Secured Portal</p>
        </div>
      </aside>

      {/* -------------------------------------------------------------
          MAIN ADMIN DASHBOARD CONTENT AREA
      ------------------------------------------------------------- */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">
        
        {/* Top Action Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 capitalize">
              {sidebarTabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-500">Shop Manager Administrative Control Center</p>
          </div>

          <button
            onClick={loadAllAdminData}
            className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            TAB 1: OVERVIEW DASHBOARD
        ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* KPI Summary Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
                <p className="text-3xl font-extrabold text-slate-900">{metrics.totalBookings}</p>
                <span className="text-[11px] text-brand-600 font-semibold">{metrics.pendingBookings} Pending Pickup</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Repairs</span>
                <p className="text-3xl font-extrabold text-brand-600">{metrics.activeRepairs}</p>
                <span className="text-[11px] text-slate-500">{metrics.completedRepairs} Completed</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Revenue</span>
                <p className="text-3xl font-extrabold text-emerald-600">₹{metrics.revenue}</p>
                <span className="text-[11px] text-emerald-700 font-semibold">{metrics.totalCustomers} Customers</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Low Stock Alert</span>
                <p className="text-3xl font-extrabold text-rose-600">{metrics.lowStockItems}</p>
                <span className="text-[11px] text-slate-500">{metrics.availableTechs} Techs Available</span>
              </div>
            </div>

            {/* SVG/Tailwind Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Daily Revenue Bar Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm">Weekly Revenue Trend (₹)</h3>
                  <span className="text-xs text-emerald-600 font-bold">+18.4% vs last week</span>
                </div>

                <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100">
                  {(analytics?.weeklyBookings || [
                    { day: "Mon", revenue: 14500 },
                    { day: "Tue", revenue: 22100 },
                    { day: "Wed", revenue: 18900 },
                    { day: "Thu", revenue: 29400 },
                    { day: "Fri", revenue: 38200 },
                    { day: "Sat", revenue: 44100 },
                    { day: "Sun", revenue: 21500 }
                  ]).map((item) => {
                    const maxRev = 50000;
                    const heightPercent = Math.round((item.revenue / maxRev) * 100);
                    return (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group">
                        <span className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{item.revenue}
                        </span>
                        <div 
                          className="w-full bg-gradient-to-t from-brand-600 to-sky-400 rounded-t-lg transition-all group-hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[11px] font-semibold text-slate-600 mt-1">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Popular Repair Types Chart */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Most Frequent Repair Categories</h3>

                <div className="space-y-3 pt-2">
                  {[
                    { label: "Screen Damage Replacement", percent: 48, color: "bg-brand-600" },
                    { label: "High Capacity Battery Swap", percent: 28, color: "bg-sky-500" },
                    { label: "Water Damage Ultrasonic De-oxidation", percent: 15, color: "bg-emerald-500" },
                    { label: "Charging Port & Speaker Repair", percent: 9, color: "bg-amber-500" }
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{cat.label}</span>
                        <span className="font-bold text-slate-900">{cat.percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: BOOKINGS MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Booking ID, customer name, phone, mobile model..."
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={bookingFilterStatus}
                  onChange={e => setBookingFilterStatus(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Booked">Booked</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="Diagnosing">Diagnosing</option>
                  <option value="Repairing">Repairing</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Mobile Device</th>
                      <th className="p-4">Issue</th>
                      <th className="p-4">Assigned Tech</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Cost</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((b) => (
                      <tr key={b.bookingId} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-extrabold text-slate-900">{b.bookingId}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{b.customerName}</p>
                          <p className="text-slate-500 text-[11px]">{b.phone}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{b.brand} {b.model}</td>
                        <td className="p-4 text-slate-600">{b.category}</td>
                        <td className="p-4 font-medium text-slate-700">{b.techName || 'Unassigned'}</td>
                        <td className="p-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStatus(b.bookingId, e.target.value)}
                            className="p-1.5 rounded-lg border border-slate-200 font-bold text-xs bg-brand-50 text-brand-800 focus:outline-none"
                          >
                            <option value="Booked">Booked</option>
                            <option value="Picked Up">Picked Up</option>
                            <option value="Diagnosing">Diagnosing</option>
                            <option value="Repairing">Repairing</option>
                            <option value="Quality Check">Quality Check</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 text-right font-extrabold text-brand-700">₹{b.finalCost || b.totalCost}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-brand-600 text-white font-bold text-[11px] transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Booking Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-pastel border border-sky-100 overflow-hidden my-8 p-6 sm:p-8 space-y-6">
                  
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-extrabold text-slate-900">{selectedBooking.bookingId}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold text-xs">
                          {selectedBooking.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedBooking.brand} {selectedBooking.model} • Customer: {selectedBooking.customerName} ({selectedBooking.phone})
                      </p>
                    </div>

                    <button onClick={() => setSelectedBooking(null)} className="p-1 rounded-full hover:bg-slate-100">
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                    {/* Assign Technician */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-slate-800">Assign Technician</h4>
                      <select
                        value={selectedBooking.assignedTechId || ''}
                        onChange={(e) => handleAssignTechnician(selectedBooking.bookingId, e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                      >
                        <option value="">Choose Technician...</option>
                        {technicians.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.spec}) - {t.status}</option>
                        ))}
                      </select>

                      <div className="pt-2">
                        <label className="block text-slate-700 font-bold mb-1">Technician Diagnostic Notes</label>
                        <textarea
                          rows={2}
                          value={techNotes || selectedBooking.diagnosticNotes || ''}
                          onChange={e => setTechNotes(e.target.value)}
                          placeholder="e.g. OLED screen replaced. Re-soldered charging flex cable..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                        />
                        <button
                          onClick={handleSaveTechNotes}
                          className="mt-2 py-1.5 px-3 rounded-lg bg-slate-900 text-white font-bold text-xs"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>

                    {/* Send Additional Cost Request */}
                    <form onSubmit={handleSendExtraCost} className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                      <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Send Additional Cost Request</span>
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        Request customer approval for extra repair components found during diagnosis.
                      </p>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-900 uppercase">Additional Amount (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 800"
                          value={extraCostAmt}
                          onChange={e => setExtraCostAmt(e.target.value)}
                          className="w-full p-2 rounded-xl border border-amber-300 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-900 uppercase">Reason for Extra Cost</label>
                        <input
                          type="text"
                          placeholder="e.g. Cracked ear speaker flex requires replacement"
                          value={extraCostReason}
                          onChange={e => setExtraCostReason(e.target.value)}
                          className="w-full p-2 rounded-xl border border-amber-300 text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                      >
                        Send Cost Request to Customer
                      </button>
                    </form>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => onOpenInvoice(selectedBooking)}
                      className="py-2 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs"
                    >
                      Print Official Invoice
                    </button>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                    >
                      Close Window
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: CUSTOMERS DIRECTORY
        ------------------------------------------------------------- */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Registered Customer Directory ({customers.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Total Repairs</th>
                    <th className="p-4 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{c.name}</td>
                      <td className="p-4 text-slate-600">{c.email}</td>
                      <td className="p-4 text-slate-600">{c.phone}</td>
                      <td className="p-4 font-bold text-brand-600">{c.totalBookings || 0}</td>
                      <td className="p-4 text-right font-extrabold text-emerald-600">₹{c.totalSpent || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: TECHNICIAN MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'technicians' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base">Technician Roster ({technicians.length})</h3>
              <button
                onClick={() => setShowTechModal(true)}
                className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Technician</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicians.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                        <p className="text-[11px] text-slate-500">{t.spec}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 flex justify-between items-center">
                    <span>Phone: {t.phone}</span>
                    <button onClick={() => handleDeleteTechnician(t.id)} className="text-rose-600 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Technician Modal */}
            {showTechModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleAddTechnician} className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Add New Technician</h3>
                  
                  <div>
                    <label className="block text-xs font-bold mb-1">Technician Name</label>
                    <input type="text" required value={newTech.name} onChange={e => setNewTech({ ...newTech, name: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Phone Number</label>
                    <input type="text" required value={newTech.phone} onChange={e => setNewTech({ ...newTech, phone: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Specialization</label>
                    <input type="text" value={newTech.spec} onChange={e => setNewTech({ ...newTech, spec: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowTechModal(false)} className="py-2 px-4 rounded-xl bg-slate-100 text-xs font-bold">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold">Add Tech</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: INVENTORY MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Spare Parts Inventory Stock</h3>
                <p className="text-xs text-slate-500">Auto Low Stock alerts are generated when quantity falls below reorder limits.</p>
              </div>
              <button
                onClick={() => setShowInvModal(true)}
                className="py-2 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Spare Part</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="p-4">Part Name</th>
                    <th className="p-4">Compatible Model</th>
                    <th className="p-4">Supplier</th>
                    <th className="p-4 text-center">Stock Qty</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Unit Price</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{inv.name}</td>
                      <td className="p-4 text-slate-600">{inv.model}</td>
                      <td className="p-4 text-slate-500">{inv.supplier}</td>
                      <td className="p-4 text-center font-extrabold text-sm">{inv.quantity}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.quantity <= inv.reorderLevel ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inv.quantity <= inv.reorderLevel ? '⚠️ Low Stock Alert' : 'In Stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900">₹{inv.price}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleRestockInventory(inv, 10)}
                          className="py-1 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]"
                        >
                          + Restock 10 Units
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Inventory Modal */}
            {showInvModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleAddInventory} className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Add Spare Part Item</h3>
                  
                  <div>
                    <label className="block text-xs font-bold mb-1">Part Name</label>
                    <input type="text" required value={newInv.name} onChange={e => setNewInv({ ...newInv, name: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">Compatible Model</label>
                      <input type="text" value={newInv.model} onChange={e => setNewInv({ ...newInv, model: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Quantity</label>
                      <input type="number" value={newInv.quantity} onChange={e => setNewInv({ ...newInv, quantity: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">Unit Price (₹)</label>
                      <input type="number" value={newInv.price} onChange={e => setNewInv({ ...newInv, price: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Reorder Limit</label>
                      <input type="number" value={newInv.reorderLevel} onChange={e => setNewInv({ ...newInv, reorderLevel: e.target.value })} className="w-full p-2.5 rounded-xl border text-xs" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowInvModal(false)} className="py-2 px-4 rounded-xl bg-slate-100 text-xs font-bold">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold">Save Part</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 6: PAYMENTS & INVOICES
        ------------------------------------------------------------- */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Payment Transactions & Official Invoices
            </h3>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.bookingId} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <p className="font-bold text-slate-900">INV-{b.bookingId} • {b.customerName}</p>
                    <p className="text-slate-500">{b.brand} {b.model} ({b.category})</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-emerald-600 text-base">₹{b.finalCost || b.totalCost}</span>
                    <button
                      onClick={() => onOpenInvoice(b)}
                      className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 7: SHOP DETAILS & PRICES MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'shop' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6 animate-fade-in">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Shop Details & Price Management</h3>
              <p className="text-xs text-slate-500">
                Updating shop details here automatically reflects across the User Website.
              </p>
            </div>

            <form onSubmit={handleSaveShopDetails} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={shopForm.name || ''}
                    onChange={e => setShopForm({ ...shopForm, name: e.target.value })}
                    className="w-full p-3 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop Tagline</label>
                  <input
                    type="text"
                    value={shopForm.tagline || ''}
                    onChange={e => setShopForm({ ...shopForm, tagline: e.target.value })}
                    className="w-full p-3 rounded-xl border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={shopForm.phone || ''}
                    onChange={e => setShopForm({ ...shopForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={shopForm.email || ''}
                    onChange={e => setShopForm({ ...shopForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl border text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Active Promo Discount (%)</label>
                  <input
                    type="number"
                    value={shopForm.activeDiscountPercent || 10}
                    onChange={e => setShopForm({ ...shopForm, activeDiscountPercent: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shop Address</label>
                <input
                  type="text"
                  value={shopForm.address || ''}
                  onChange={e => setShopForm({ ...shopForm, address: e.target.value })}
                  className="w-full p-3 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={shopForm.workingHours || ''}
                  onChange={e => setShopForm({ ...shopForm, workingHours: e.target.value })}
                  className="w-full p-3 rounded-xl border text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Top Banner Text</label>
                <input
                  type="text"
                  value={shopForm.announcement || ''}
                  onChange={e => setShopForm({ ...shopForm, announcement: e.target.value })}
                  className="w-full p-3 rounded-xl border text-xs font-semibold"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md"
                >
                  Save & Publish Live to User Website
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 8: CUSTOMER QUERIES MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-fade-in">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Customer Support Queries ({queries.length})
            </h3>

            <div className="space-y-4">
              {queries.map((q) => (
                <div key={q.queryId} className="p-4 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900">{q.queryId} — {q.customerName} ({q.phone})</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      q.status === 'Replied' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <p className="font-bold text-slate-800">{q.subject}</p>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-xl">{q.message}</p>

                  {q.response && (
                    <div className="p-3 bg-brand-50 text-brand-900 rounded-xl font-medium">
                      <strong>Admin Reply:</strong> {q.response}
                    </div>
                  )}

                  <button
                    onClick={() => { setReplyingQuery(q); setQueryReplyText(q.response || ''); }}
                    className="py-1.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    Reply to Customer Query
                  </button>
                </div>
              ))}
            </div>

            {/* Reply Modal */}
            {replyingQuery && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <form onSubmit={handleSendQueryReply} className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Reply to Query {replyingQuery.queryId}</h3>
                  <p className="text-xs text-slate-500">Customer: {replyingQuery.customerName} ({replyingQuery.subject})</p>

                  <textarea
                    rows={4}
                    required
                    placeholder="Type official shop response..."
                    value={queryReplyText}
                    onChange={e => setQueryReplyText(e.target.value)}
                    className="w-full p-3 rounded-xl border text-xs"
                  />

                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setReplyingQuery(null)} className="py-2 px-4 rounded-xl bg-slate-100 text-xs font-bold">Cancel</button>
                    <button type="submit" className="py-2 px-4 rounded-xl bg-brand-600 text-white text-xs font-bold">Send Reply</button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 9: ANALYTICS & REPORTS
        ------------------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6 animate-fade-in">
            <h3 className="font-bold text-slate-900 text-lg">Shop Performance & Turnaround Analytics</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <span className="text-[10px] uppercase font-bold text-slate-500">Avg Repair Time</span>
                <p className="text-2xl font-extrabold text-brand-700">45 Minutes</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-slate-500">Customer Satisfaction</span>
                <p className="text-2xl font-extrabold text-emerald-700">98.5%</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-slate-500">Repeat Customers</span>
                <p className="text-2xl font-extrabold text-amber-800">32.1%</p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 10: SETTINGS & SMS/WHATSAPP GATEWAY
        ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-fade-in text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              SMS & WhatsApp Gateway Integration Settings
            </h3>

            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Twilio Account SID (SMS Integration)</label>
                <input type="text" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx" className="w-full p-2.5 rounded-xl border text-xs font-mono" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Business Cloud API Token</label>
                <input type="password" value="••••••••••••••••••••••••" readOnly className="w-full p-2.5 rounded-xl border text-xs font-mono" />
              </div>

              <p className="text-xs text-slate-500 italic">
                Automated status notifications are dispatched over SMS & WhatsApp on booking state transitions.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
