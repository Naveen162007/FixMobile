import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RoleSelector from './components/RoleSelector';
import AuthModal from './components/AuthModal';
import BookingWizard from './components/BookingWizard';
import StatusTracker from './components/StatusTracker';
import AiAssistant from './components/AiAssistant';
import CustomerQueries from './components/CustomerQueries';
import InvoiceModal from './components/InvoiceModal';
import SmsWhatsAppPreview from './components/SmsWhatsAppPreview';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './utils/api';

export default function App() {
  const [role, setRole] = useState(null); // 'user', 'admin', or null (shows RoleSelector initial page)
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'book', 'track', 'ai', 'queries', 'dashboard'

  // Backend store states
  const [shopDetails, setShopDetails] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Modals & Drawers
  const [showRoleSelectorModal, setShowRoleSelectorModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [showSmsDrawer, setShowSmsDrawer] = useState(false);

  // Booking Prefill
  const [prefillCategory, setPrefillCategory] = useState(null);

  useEffect(() => {
    async function loadShopAndServices() {
      try {
        const [shop, srvList, revList, notifList] = await Promise.all([
          api.getShopDetails(),
          api.getServices(),
          api.getReviews(),
          api.getNotifications()
        ]);
        setShopDetails(shop);
        setServices(srvList);
        setReviews(revList);
        setNotifications(notifList);
      } catch (err) {
        console.warn('Failed to load shop details from API, using defaults:', err.message);
      }
    }
    loadShopAndServices();
  }, []);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setShowRoleSelectorModal(false);
    if (selectedRole === 'admin' && (!user || user.role !== 'admin')) {
      setShowAuthModal(true);
    }
  };

  const handleSwitchRole = () => {
    if (role === 'user') {
      setRole('admin');
      if (!user || user.role !== 'admin') {
        setShowAuthModal(true);
      }
    } else {
      setRole('user');
      setActiveTab('home');
    }
  };

  const handleAuthSuccess = (authUser, token) => {
    setUser(authUser);
    setShowAuthModal(false);
    if (authUser.role === 'admin') {
      setRole('admin');
    } else {
      setRole('user');
    }
  };

  const handleLogout = () => {
    setUser(null);
    if (role === 'admin') {
      setRole('user');
      setActiveTab('home');
    }
  };

  const handleOpenInvoice = (booking) => {
    setSelectedInvoiceBooking(booking);
    setShowInvoiceModal(true);
  };

  const handleBookingComplete = (booking, notification) => {
    if (notification) {
      setNotifications(prev => [notification, ...prev]);
    }
    setSelectedInvoiceBooking(booking);
    setActiveTab('track');
  };

  const handleSelectCategoryFromAi = (categoryName) => {
    setPrefillCategory(categoryName);
    setActiveTab('book');
  };

  // 1. INITIAL ROLE SELECTION PAGE (When role is null)
  if (!role) {
    return <RoleSelector onSelectRole={handleSelectRole} currentRole={role} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Global Header */}
      <Header
        role={role}
        user={user}
        onSwitchRole={handleSwitchRole}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shopDetails={shopDetails}
        notifications={notifications}
        onOpenNotifications={() => setShowSmsDrawer(true)}
      />

      {/* Main Body view based on Role & Active Tab */}
      <div className="flex-1">
        {role === 'admin' ? (
          /* Protected Admin Interface */
          user && user.role === 'admin' ? (
            <AdminDashboard
              adminUser={user}
              shopDetails={shopDetails}
              onShopDetailsUpdated={(updated) => setShopDetails(updated)}
              onOpenInvoice={handleOpenInvoice}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-pastel border border-sky-100 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                🔒
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Authentication Required</h2>
              <p className="text-xs text-slate-500">
                Please sign in with authorized shop owner credentials to access the Admin Dashboard.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
              >
                Sign In to Admin Portal
              </button>
            </div>
          )
        ) : (
          /* Customer Interface */
          <main>
            {activeTab === 'home' && (
              <Home
                shopDetails={shopDetails}
                services={services}
                reviews={reviews}
                onStartBooking={() => setActiveTab('book')}
                onOpenAi={() => setActiveTab('ai')}
              />
            )}

            {activeTab === 'book' && (
              <BookingWizard
                user={user}
                onOpenAuth={() => setShowAuthModal(true)}
                onBookingComplete={handleBookingComplete}
                prefillCategory={prefillCategory}
                shopDetails={shopDetails}
              />
            )}

            {activeTab === 'track' && (
              <StatusTracker
                initialBookingId={selectedInvoiceBooking?.bookingId || ''}
                onOpenInvoice={handleOpenInvoice}
              />
            )}

            {activeTab === 'ai' && (
              <AiAssistant
                onSelectCategoryForBooking={handleSelectCategoryFromAi}
              />
            )}

            {activeTab === 'queries' && (
              <CustomerQueries
                user={user}
              />
            )}

            {activeTab === 'dashboard' && (
              <UserDashboard
                user={user}
                onOpenInvoice={handleOpenInvoice}
                onOpenNotifications={() => setShowSmsDrawer(true)}
                onStartBooking={() => setActiveTab('book')}
              />
            )}
          </main>
        )}
      </div>

      {/* Customer Footer */}
      {role === 'user' && (
        <Footer shopDetails={shopDetails} setActiveTab={setActiveTab} />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        role={role}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Official Tax Invoice & Warranty Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        booking={selectedInvoiceBooking}
        shopDetails={shopDetails}
      />

      {/* SMS & WhatsApp Notification Drawer Placeholder */}
      <SmsWhatsAppPreview
        isOpen={showSmsDrawer}
        onClose={() => setShowSmsDrawer(false)}
        notifications={notifications}
      />

    </div>
  );
}
