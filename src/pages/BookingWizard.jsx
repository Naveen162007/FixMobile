import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle2, Shield, Calendar, Clock, MapPin, Tag, AlertCircle, ArrowRight, ArrowLeft, Upload, Zap } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR } from '../utils/formatters';

export default function BookingWizard({ initialData, currentUser, onBookingConfirmed, onNavigate }) {
  const [step, setStep] = useState(1);

  // Form State
  const [brand, setBrand] = useState(initialData?.brand || 'Apple');
  const [model, setModel] = useState(initialData?.model || 'iPhone 14');
  const [modelsList, setModelsList] = useState([]);
  
  const [serviceName, setServiceName] = useState(initialData?.service_name || 'Screen Replacement');
  const [servicesList, setServicesList] = useState([]);
  const [partQuality, setPartQuality] = useState(initialData?.quality || 'Original');
  
  const [serviceType, setServiceType] = useState('Doorstep'); // Visit Store / Doorstep / Pickup & Delivery
  const [serviceArea, setServiceArea] = useState('RS Puram');
  const [isExpress, setIsExpress] = useState(false);
  
  const [scheduledDate, setScheduledDate] = useState('2026-09-22');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  
  const [name, setName] = useState(currentUser?.name || 'Ananya Sundaram');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 11111');
  const [email, setEmail] = useState(currentUser?.email || 'ananya.cbe@gmail.com');
  const [address, setAddress] = useState('142 East TV Swamy Road, RS Puram, Coimbatore');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  
  const [isFirstBookingEligible, setIsFirstBookingEligible] = useState(true);
  const [bookingResult, setBookingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch Brands & Services
  useEffect(() => {
    fetchApi(`/services/models?brand=${brand}`)
      .then(data => {
        setModelsList(data);
        if (data.length > 0 && !initialData?.model) setModel(data[0].name);
      })
      .catch(console.error);
  }, [brand]);

  useEffect(() => {
    fetchApi('/services').then(setServicesList).catch(console.error);
  }, []);

  // Check First Booking eligibility from backend
  useEffect(() => {
    if (email || phone) {
      fetchApi(`/bookings/check-first-booking?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`)
        .then(res => setIsFirstBookingEligible(res.isEligible))
        .catch(console.error);
    }
  }, [email, phone]);

  // Calculate pricing breakdown
  const selectedServiceObj = servicesList.find(s => s.name === serviceName) || { base_price: 2499 };
  const basePrice = selectedServiceObj.base_price || 2499;

  let qualityMult = 1.0;
  if (partQuality === 'OEM') qualityMult = 0.75;
  if (partQuality === 'Compatible') qualityMult = 0.55;

  let calculatedSubtotal = Math.round(basePrice * qualityMult);
  if (isExpress) calculatedSubtotal += 299;
  if (serviceType === 'Doorstep' || serviceType === 'Pickup & Delivery') calculatedSubtotal += 149;

  let estimatedDiscount = 0;
  if (isFirstBookingEligible) {
    estimatedDiscount = Math.round(calculatedSubtotal * 0.10);
  } else if (couponCode.toUpperCase() === 'KOVAI15') {
    estimatedDiscount = Math.round(calculatedSubtotal * 0.15);
  }

  const finalEstimatedAmount = calculatedSubtotal - estimatedDiscount;

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        customer_id: currentUser?.id || null,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        brand,
        model,
        problem: serviceName,
        service_name: serviceName,
        service_type: serviceType,
        service_area: serviceArea,
        part_quality: partQuality,
        is_express: isExpress,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        address: serviceType !== 'Visit Store' ? address : 'Store Visit (Gandhipuram Hub)',
        notes,
        coupon_code: couponCode
      };

      const result = await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setBookingResult(result);
      setStep(5); // Confirmation step
    } catch (err) {
      console.error('Booking submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-navy-900 min-h-screen text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>Booking Wizard</span>
            <span>Step {step} of 5</span>
          </div>

          <div className="w-full bg-navy-800 h-2 rounded-full overflow-hidden flex">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`flex-1 transition-all duration-300 ${
                  i <= step ? 'bg-gradient-to-r from-blue-600 to-cyan-400' : 'bg-transparent'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* STEP 1: Select Device */}
        {step === 1 && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-white">Select Your Mobile Device</h2>
            
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Select Brand</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Redmi', 'Vivo', 'Oppo', 'Realme', 'Google', 'Motorola'].map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      brand === b
                        ? 'bg-blue-600 border-cyanAccent text-white shadow-lg scale-105'
                        : 'bg-navy-800 border-white/5 text-slate-300 hover:bg-navy-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Select Model</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                {modelsList.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.name)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      model === m.name
                        ? 'bg-blue-600/30 border-cyanAccent text-white'
                        : 'bg-navy-800 border-white/5 text-slate-300 hover:bg-navy-700'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
            >
              <span>Next: Select Repair Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Select Problem & Service */}
        {step === 2 && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-white">Select Repair Service & Quality</h2>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Repair Problem / Service</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setServiceName(s.name)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      serviceName === s.name
                        ? 'bg-blue-600/20 border-cyanAccent text-white shadow-md'
                        : 'bg-navy-800 border-white/5 text-slate-300 hover:bg-navy-700'
                    }`}
                  >
                    <span className="font-extrabold text-sm block">{s.name}</span>
                    <span className="text-xs text-slate-400 block mt-1">{s.explanation}</span>
                    <span className="text-xs text-amber-300 font-bold block mt-2">Starts ₹{s.base_price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Select Part Quality Grade</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Original', desc: '100% Factory Grade (Recommended)' },
                  { name: 'OEM', desc: 'High Quality OEM Assembly' },
                  { name: 'Compatible', desc: 'Budget Replacement' }
                ].map(q => (
                  <button
                    key={q.name}
                    onClick={() => setPartQuality(q.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      partQuality === q.name
                        ? 'bg-blue-600 border-cyanAccent text-white'
                        : 'bg-navy-800 border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-extrabold block text-white">{q.name}</span>
                    <span className="text-[10px] block opacity-80">{q.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="w-1/3 py-3.5 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs">Back</button>
              <button onClick={() => setStep(3)} className="w-2/3 py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2">
                <span>Next: Service Type & Coimbatore Area</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Service Type & Location */}
        {step === 3 && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-white">Choose Service Type & Date</h2>

            {/* Service Type Selection */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Service Delivery Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { type: 'Doorstep', title: 'Doorstep Repair', desc: 'Tech visits your location' },
                  { type: 'Visit Store', title: 'Visit Store', desc: 'Bring phone to Gandhipuram' },
                  { type: 'Pickup & Delivery', title: 'Pickup & Delivery', desc: 'We pick up and return' }
                ].map(st => (
                  <button
                    key={st.type}
                    onClick={() => setServiceType(st.type)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      serviceType === st.type
                        ? 'bg-blue-600/30 border-cyanAccent text-white shadow-lg'
                        : 'bg-navy-800 border-white/5 text-slate-400'
                    }`}
                  >
                    <span className="font-extrabold text-sm block text-white">{st.title}</span>
                    <span className="text-xs text-slate-300 block mt-1">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Express Repair Option */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-orange-950/40 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-amber-300 block">⚡ Express 30-Min Repair</span>
                  <span className="text-xs text-slate-300">Priority technician assignment (+₹299 fee)</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isExpress}
                onChange={(e) => setIsExpress(e.target.checked)}
                className="w-6 h-6 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Coimbatore Area Selection */}
            {serviceType !== 'Visit Store' && (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Coimbatore Neighborhood / Area</label>
                <select
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                >
                  <option>Gandhipuram</option>
                  <option>RS Puram</option>
                  <option>Peelamedu / TIDEL Park</option>
                  <option>Saravanampatti</option>
                  <option>Singanallur</option>
                  <option>Saibaba Colony</option>
                  <option>Ukkadam</option>
                  <option>Race Course</option>
                  <option>Ramanathapuram</option>
                  <option>Vadavalli</option>
                </select>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Preferred Time Slot</label>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                >
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 02:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(2)} className="w-1/3 py-3.5 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs">Back</button>
              <button onClick={() => setStep(4)} className="w-2/3 py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2">
                <span>Next: Customer Details & Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Customer Details & Summary */}
        {step === 4 && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-extrabold text-white">Enter Contact Details & Confirm</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>
            </div>

            {serviceType !== 'Visit Store' && (
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Coimbatore Doorstep Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyanAccent outline-none"
                />
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div className="bg-navy-950 p-5 rounded-2xl border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">Order Price Summary</h3>
              
              <div className="flex justify-between text-xs text-slate-300">
                <span>{brand} {model} — {serviceName} ({partQuality})</span>
                <span>{formatINR(calculatedSubtotal)}</span>
              </div>

              {isFirstBookingEligible && (
                <div className="flex justify-between text-xs text-amber-300 font-bold bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
                  <span className="flex items-center gap-1">🎉 First Booking Discount (10% OFF)</span>
                  <span>-{formatINR(estimatedDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                <span>Final Estimated Amount</span>
                <span className="text-cyanAccent">{formatINR(finalEstimatedAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="w-1/3 py-3.5 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs">Back</button>
              <button
                onClick={handleSubmitBooking}
                disabled={submitting}
                className="w-2/3 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {submitting ? 'Confirming Booking...' : `Confirm & Get Booking ID`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Booking Confirmation & Booking ID */}
        {step === 5 && bookingResult && (
          <div className="glass-card rounded-3xl p-8 border border-emerald-500/40 text-center space-y-6 glow-blue animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs text-emerald-400 font-bold tracking-wider uppercase block">Booking Confirmed!</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Booking ID: <span className="text-cyanAccent">{bookingResult.bookingId}</span></h2>
              <p className="text-xs text-slate-300 mt-2">Save this Booking ID to track your live repair status.</p>
            </div>

            <div className="bg-navy-900 p-5 rounded-2xl border border-white/10 max-w-lg mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Customer</span>
                <span className="font-bold text-white">{bookingResult.booking.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Device</span>
                <span className="font-bold text-white">{bookingResult.booking.brand} {bookingResult.booking.model}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-white">{bookingResult.booking.service_name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Final Estimated Amount</span>
                <span className="font-extrabold text-emerald-400">{formatINR(bookingResult.booking.final_amount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => onNavigate('tracking', { bookingId: bookingResult.bookingId })}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-900/40"
              >
                Track Repair Timeline ({bookingResult.bookingId})
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
