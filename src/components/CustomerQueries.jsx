import React, { useState, useEffect } from 'react';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function CustomerQueries({ user }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState('Repair Issue');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadQueries = async () => {
    setLoading(true);
    try {
      const data = await api.getQueries({ userId: user?.id });
      setQueries(data);
    } catch (err) {
      console.error('Failed to load queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, [user]);

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;

    setSubmitting(true);
    setSuccessMsg('');
    try {
      const res = await api.createQuery({
        userId: user?.id || 'guest',
        customerName: user?.name || 'Customer',
        phone: user?.phone || '',
        category,
        subject,
        message
      });
      if (res.success) {
        setSuccessMsg(`Query ${res.query.queryId} created successfully! Our shop team will reply shortly.`);
        setSubject('');
        setMessage('');
        loadQueries();
      }
    } catch (err) {
      alert('Failed to submit query: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-6">
      
      {/* Create Support Query Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pastel border border-sky-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Submit Customer Query / Ticket</h2>
            <p className="text-xs text-slate-500">Have a question regarding your repair, warranty, or payment?</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitQuery} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              >
                <option value="Booking Issue">Booking Issue</option>
                <option value="Repair Issue">Repair Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Delivery Issue">Delivery Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Screen warranty questions"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Details</label>
            <textarea
              rows={3}
              required
              placeholder="Describe your query or issue in detail..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-200 flex items-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Support Query'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Customer Queries List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-pastel border border-sky-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
          My Submitted Support Tickets ({queries.length})
        </h3>

        {loading ? (
          <p className="text-xs text-slate-400 py-4 text-center">Loading support queries...</p>
        ) : queries.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No support queries logged yet.</p>
        ) : (
          <div className="space-y-4">
            {queries.map((q) => (
              <div key={q.queryId} className="p-4 rounded-2xl border border-slate-200 hover:border-sky-200 transition-colors bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-800">{q.queryId}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {q.category}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    q.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    q.status === 'Replied' ? 'bg-sky-100 text-sky-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {q.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{q.subject}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{q.message}</p>
                </div>

                {/* Admin Reply Box */}
                {q.response ? (
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-sky-900">
                      <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                      <span>Shop Owner / Support Response:</span>
                    </div>
                    <p className="leading-relaxed">{q.response}</p>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">Waiting for shop manager reply...</p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
