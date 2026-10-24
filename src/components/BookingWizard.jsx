import React, { useState, useEffect } from 'react';
import { Smartphone, Check, ArrowRight, ArrowLeft, Calendar, Clock, MapPin, Upload, AlertCircle, ShieldCheck, CheckCircle, Tag, DollarSign } from 'lucide-react';
import { api } from '../utils/api';

export default function BookingWizard({ user, onOpenAuth, onBookingComplete, prefillCategory, shopDetails }) {
  const [step, setStep] = useState(1);
  const [brands, setBrands] = useState([]);
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);

  // Form State
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(prefillCategory || null);
  const [problemDesc, setProblemDesc] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [serviceMethod, setServiceMethod] = useState('Visit Repair Shop'); // Visit Repair Shop, Pickup & Delivery, Doorstep Service
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInitial() {
      try {
        const [bData, sData, slotData, bookData] = await Promise.all([
          api.getBrands(),
          api.getServices(),
          api.getTimeSlots(),
          api.getBookings()
        ]);
        setBrands(Array.isArray(bData) ? bData : []);
        setServices(Array.isArray(sData) ? sData : []);
        
        // Normalize time slots ensuring every item is a clean string (even if API returns objects from MongoDB)
        const normalizedSlots = (Array.isArray(slotData) ? slotData : []).map(s => {
          if (typeof s === 'string') return s.trim();
          if (s && typeof s === 'object') {
            if (s.slot) return String(s.slot).trim();
            if (s.time) return String(s.time).trim();
            if (s.timeSlot) return String(s.timeSlot).trim();
            const keys = Object.keys(s).filter(k => !isNaN(k)).sort((a, b) => Number(a) - Number(b));
            if (keys.length > 0) return keys.map(k => s[k]).join('').trim();
          }
          return String(s || '').trim();
        }).filter(Boolean);

        const defaultSlots = [
          "10:00 AM - 11:00 AM",
          "11:00 AM - 12:00 PM",
          "02:00 PM - 03:00 PM",
          "04:00 PM - 05:00 PM",
          "06:00 PM - 07:00 PM"
        ];
        setTimeSlots(normalizedSlots.length > 0 ? normalizedSlots : defaultSlots);
        setExistingBookings(Array.isArray(bookData) ? bookData : []);

        if (Array.isArray(bData) && bData.length > 0) {
          setSelectedBrand(bData[0]);
          setSelectedModel(bData[0].models[0]);
        }
        if (prefillCategory) {
          const matched = sData.find(s => s.category === prefillCategory);
          if (matched) setSelectedCategory(matched);
        } else if (sData.length > 0) {
          setSelectedCategory(sData[0]);
        }
      } catch (err) {
        console.error('Failed to load booking initial data:', err);
      }
    }
    loadInitial();
  }, [prefillCategory]);

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
      if (user.address) setAddress(user.address);
    }
  }, [user]);

  // Handle Photo upload mock / FileReader
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cost calculation
  const partCost = selectedCategory?.basePartCost || 0;
  const labourCost = selectedCategory?.labourCost || 0;
  const pickupFee = serviceMethod === 'Pickup & Delivery' 
    ? (shopDetails?.basePickupFee || 150) 
    : serviceMethod === 'Doorstep Service' 
      ? (shopDetails?.baseDoorstepFee || 250) 
      : 0;

  const discountPercent = shopDetails?.activeDiscountPercent || 10;
  const subtotal = partCost + labourCost + pickupFee;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalCost = Math.max(0, subtotal - discountAmount);

  // Slot availability helper
  const isSlotBooked = (slot) => {
    const slotStr = typeof slot === 'string' ? slot : (slot?.slot || String(slot || ''));
    return Array.isArray(existingBookings) && existingBookings.some(b => {
      const bSlot = typeof b.timeSlot === 'string' ? b.timeSlot : (b.timeSlot?.slot || String(b.timeSlot || ''));
      return b.date === selectedDate && bSlot === slotStr && b.status !== 'Cancelled';
    });
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (!selectedBrand || !selectedModel) {
        setError('Please select a mobile brand and model.');
        return;
      }
    } else if (step === 2) {
      if (!selectedCategory) {
        setError('Please select a repair problem category.');
        return;
      }
    } else if (step === 3) {
      if (!selectedDate || !selectedSlot) {
        setError('Please choose an available repair date and time slot.');
        return;
      }
    } else if (step === 5) {
      if ((serviceMethod === 'Pickup & Delivery' || serviceMethod === 'Doorstep Service') && !address) {
        setError('Please enter your full address for doorstep/pickup service.');
        return;
      }
      if (!customerName || !customerPhone) {
        setError('Please provide your name and phone number.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');
    try {
      const bookingPayload = {
        userId: user?.id || `guest-${Date.now()}`,
        customerName,
        phone: customerPhone,
        email: customerEmail,
        brand: selectedBrand.name,
        model: selectedModel,
        category: selectedCategory.category,
        problemDescription: problemDesc,
        photoUrl,
        date: selectedDate,
        timeSlot: typeof selectedSlot === 'string' ? selectedSlot : (selectedSlot?.slot || String(selectedSlot || '')),
        serviceMethod,
        address,
        partCost,
        labourCost,
        pickupFee,
        discount: discountAmount,
        totalCost
      };

      const res = await api.createBooking(bookingPayload);
      if (res.success) {
        onBookingComplete(res.booking, res.notification);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit repair booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-pastel border border-sky-100 overflow-hidden my-6">
      
      {/* Wizard Header Progress Bar */}
      <div className="bg-gradient-to-r from-brand-600 via-sky-600 to-brand-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">Step-by-Step Booking</span>
            <h2 className="text-2xl font-bold">Book Your Mobile Repair</h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-sky-200">Step {step} of 6</span>
            <p className="text-sm font-bold">
              {step === 1 && 'Select Phone'}
              {step === 2 && 'Select Issue'}
              {step === 3 && 'Choose Slot'}
              {step === 4 && 'Cost Estimate'}
              {step === 5 && 'Service Mode'}
              {step === 6 && 'Summary & Confirm'}
            </p>
          </div>
        </div>

        {/* 6 Step Progress Dots */}
        <div className="grid grid-cols-6 gap-2 pt-2 border-t border-white/20">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div 
              key={num}
              className={`h-2 rounded-full transition-all duration-300 ${num <= step ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* Form Content Body */}
      <div className="p-6 sm:p-8">
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 1: SELECT BRAND & MODEL
        ------------------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">1. Choose Mobile Brand</h3>
              <p className="text-xs text-slate-500 mb-4">Select the brand of your smartphone requiring repair.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(b);
                      setSelectedModel(b.models[0]);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      selectedBrand?.id === b.id 
                        ? 'border-brand-500 bg-brand-50/70 text-brand-700 shadow-soft ring-2 ring-brand-200 font-bold' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-sm">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedBrand && (
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Select {selectedBrand.name} Model</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedBrand.models.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedModel(m)}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        selectedModel === m
                          ? 'border-brand-500 bg-brand-600 text-white font-semibold shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 2: SELECT PROBLEM CATEGORY & DESCRIPTION
        ------------------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">2. Select Problem Category</h3>
              <p className="text-xs text-slate-500 mb-4">What seems to be broken or malfunctioning with your phone?</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedCategory(srv)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedCategory?.id === srv.id
                        ? 'border-brand-500 bg-brand-50/80 text-brand-900 ring-2 ring-brand-200 shadow-soft'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-800">{srv.category}</span>
                      {srv.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.label}</p>
                    <p className="text-xs font-semibold text-brand-600 mt-2">Est. Part + Labour: ₹{srv.basePartCost + srv.labourCost}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Describe Problem (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Touch is sluggish on left side and screen has green vertical lines after dropping..."
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Upload Photo of Damage (Optional)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 text-slate-600 text-xs font-medium cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-brand-600" />
                  <span>Choose Image File</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {photoUrl && (
                  <div className="flex items-center gap-2">
                    <img src={photoUrl} alt="Damage preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                    <span className="text-xs text-emerald-600 font-semibold">Photo Attached</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 3: CHOOSE DATE & TIME SLOT
        ------------------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">3. Select Date & Time Slot</h3>
              <p className="text-xs text-slate-500 mb-4">Choose a convenient date and timing for your repair service.</p>

              <div className="mb-6 max-w-xs">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <span>Repair Date</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot('');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Available Time Slots for {selectedDate}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const slotStr = typeof slot === 'string' ? slot : (slot?.slot || String(slot || ''));
                  const booked = isSlotBooked(slotStr);
                  return (
                    <button
                      key={slotStr}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedSlot(slotStr)}
                      className={`p-3.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                        booked 
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : selectedSlot === slotStr
                            ? 'bg-brand-600 border-brand-600 text-white font-semibold shadow-sm'
                            : 'border-slate-200 hover:border-brand-300 text-slate-700 hover:bg-brand-50/50'
                      }`}
                    >
                      <span>{slotStr}</span>
                      {booked ? (
                        <span className="text-[10px] uppercase font-bold text-rose-500">Booked</span>
                      ) : selectedSlot === slotStr ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-emerald-600">Available</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 4: ESTIMATED COST BREAKDOWN
        ------------------------------------------------------------- */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">4. Transparent Estimated Cost</h3>
              <p className="text-xs text-slate-500 mb-6">Here is an itemized breakdown of repair parts, labor, and discount.</p>

              <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Spare Part Cost ({selectedCategory?.category})</span>
                  <span className="font-semibold text-slate-800">₹{partCost}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Technician Labour / Service Charge</span>
                  <span className="font-semibold text-slate-800">₹{labourCost}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Service Logistics ({serviceMethod})</span>
                  <span className="font-semibold text-slate-800">{pickupFee > 0 ? `₹${pickupFee}` : 'FREE (In-Store)'}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>FixMobile Special Discount ({discountPercent}%)</span>
                    </span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-sky-200 flex justify-between items-center text-lg font-extrabold text-slate-900">
                  <span>Estimated Total</span>
                  <span className="text-brand-700 text-2xl">₹{totalCost}</span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Important Notice on Repair Costs:</strong>
                  <p className="mt-0.5 text-amber-700">
                    This amount is an <em>estimated cost</em> based on reported symptoms. If our certified technician discovers additional internal damage during diagnosis, an explicit approval request will be sent to your dashboard before proceeding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 5: CHOOSE SERVICE METHOD & ADDRESS
        ------------------------------------------------------------- */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">5. Choose Service Method</h3>
              <p className="text-xs text-slate-500 mb-4">Select how you would like us to service your mobile phone.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { title: 'Visit Repair Shop', fee: 'Free', desc: 'Bring your phone to our central shop hub.' },
                  { title: 'Pickup & Delivery', fee: `+₹${shopDetails?.basePickupFee || 150}`, desc: 'We pick up phone, fix at lab & deliver back.' },
                  { title: 'Doorstep Service', fee: `+₹${shopDetails?.baseDoorstepFee || 250}`, desc: 'Tech repairs phone at your doorstep.' }
                ].map((m) => (
                  <button
                    key={m.title}
                    type="button"
                    onClick={() => setServiceMethod(m.title)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      serviceMethod === m.title
                        ? 'border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-200 shadow-soft'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-slate-800">{m.title}</span>
                      <span className="text-xs font-semibold text-brand-600">{m.fee}</span>
                    </div>
                    <p className="text-xs text-slate-500">{m.desc}</p>
                  </button>
                ))}
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800">Customer Details</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {(serviceMethod === 'Pickup & Delivery' || serviceMethod === 'Doorstep Service') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Address / Location *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="House No., Street name, Landmark, City & Pincode..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STEP 6: BOOKING SUMMARY & CONFIRMATION
        ------------------------------------------------------------- */}
        {step === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">6. Booking Summary & Final Confirmation</h3>
              <p className="text-xs text-slate-500 mb-6">Please verify all booking details before confirming your repair request.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-brand-600 mb-2">Customer & Mobile</h4>
                  <p><strong>Name:</strong> {customerName}</p>
                  <p><strong>Phone:</strong> {customerPhone}</p>
                  <p><strong>Mobile Device:</strong> {selectedBrand?.name} {selectedModel}</p>
                  <p><strong>Repair Issue:</strong> {selectedCategory?.category}</p>
                  {problemDesc && <p><strong>Details:</strong> {problemDesc}</p>}
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] text-brand-600 mb-2">Slot & Method</h4>
                  <p><strong>Date:</strong> {selectedDate}</p>
                  <p><strong>Time Slot:</strong> {selectedSlot}</p>
                  <p><strong>Service Method:</strong> {serviceMethod}</p>
                  {address && <p><strong>Address:</strong> {address}</p>}
                  <p className="mt-2 text-brand-700 font-extrabold text-base"><strong>Est. Total:</strong> ₹{totalCost}</p>
                </div>
              </div>

              {!user && (
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-center justify-between">
                  <span>💡 You are booking as Guest. Sign in to automatically link this repair to your account.</span>
                  <button type="button" onClick={onOpenAuth} className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold">
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="py-2.5 px-5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-200 flex items-center gap-2 transition-all"
            >
              <span>Continue to Step {step + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmBooking}
              className="py-3.5 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-200 flex items-center gap-2 transition-all"
            >
              {loading ? 'Generating Booking...' : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirm Repair Booking</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
