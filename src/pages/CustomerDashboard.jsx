import React, { useState, useEffect } from 'react';
import { User, Smartphone, Clock, Award, FileText, Star, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR, getStatusBadgeClass } from '../utils/formatters';

export default function CustomerDashboard({ currentUser, onNavigate, onViewInvoice }) {
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchApi(`/bookings?customer_email=${encodeURIComponent(currentUser?.email || 'ananya.cbe@gmail.com')}`)
      .then(setBookings)
      .catch(console.error);
  }, [currentUser]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    try {
      await fetchApi(`/bookings/${reviewModalBooking.id}/review`, {
        method: 'POST',
        body: JSON.stringify({
          customer_name: currentUser?.name || 'Customer',
          rating,
          review_text: reviewText
        })
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewModalBooking(null);
        setReviewSubmitted(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-12 bg-navy-900 min-h-screen text-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 glow-blue">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-xl">
              <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center">
                <User className="w-8 h-8 text-cyanAccent" />
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Customer Portal</span>
              <h1 className="text-2xl font-extrabold text-white">{currentUser?.name || 'Ananya Sundaram'}</h1>
              <p className="text-xs text-slate-300">{currentUser?.email} • {currentUser?.phone}</p>
            </div>
          </div>

          <div className="bg-navy-950/80 px-6 py-3.5 rounded-2xl border border-white/10 text-center">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Kovai Loyalty Points</span>
            <span className="text-2xl font-extrabold text-amber-300 flex items-center justify-center gap-1">
              <Award className="w-5 h-5 text-amber-400" /> {currentUser?.points || 120} PTS
            </span>
          </div>
        </div>

        {/* Active & Historical Bookings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Your Repair Bookings & Status</h2>
            <button
              onClick={() => onNavigate('booking')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
            >
              + New Repair Booking
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {bookings.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
                No repair bookings recorded yet. Click above to book your first repair!
              </div>
            ) : (
              bookings.map(b => (
                <div key={b.id} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 hover:border-blue-500/40 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-xs text-cyanAccent font-mono font-bold block">{b.id}</span>
                      <h3 className="text-base font-extrabold text-white">{b.brand} {b.model} — <span className="text-slate-300">{b.service_name}</span></h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(b.status)}`}>
                        {b.status} ({b.progress_percent}%)
                      </span>
                      <span className="text-lg font-extrabold text-white">{formatINR(b.final_amount)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full transition-all" style={{ width: `${b.progress_percent}%` }}></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2">
                    <div>
                      <span>Scheduled: <strong>{b.scheduled_date} at {b.scheduled_time}</strong></span>
                      <span className="ml-3">Type: <strong className="text-white">{b.service_type}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('tracking', { bookingId: b.id })}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 text-cyanAccent border border-blue-500/30 font-bold hover:bg-blue-600 hover:text-white transition-all"
                      >
                        Track Progress
                      </button>

                      <button
                        onClick={() => onViewInvoice(b.id)}
                        className="px-3 py-1.5 rounded-lg bg-navy-800 text-slate-200 border border-white/10 font-bold hover:bg-white/10 transition-all"
                      >
                        Digital Invoice
                      </button>

                      {b.status === 'Delivered' && (
                        <button
                          onClick={() => setReviewModalBooking(b)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all"
                        >
                          Write Review ⭐
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Review Modal */}
        {reviewModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-navy-900 border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Review Service for {reviewModalBooking.id}</h3>
              
              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-950 text-emerald-300 rounded-xl text-center font-bold text-xs">
                  ✅ Thank you! Your review has been published.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Rating</label>
                    <div className="flex gap-2 text-amber-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 block mb-1">Review Feedback</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      placeholder="How was your repair experience in Kovai?"
                      className="w-full bg-navy-800 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-cyanAccent outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => setReviewModalBooking(null)} className="w-1/3 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs">Cancel</button>
                    <button type="submit" className="w-2/3 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">Submit Review</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
