import React, { useState, useEffect } from 'react';
import { Printer, Download, ArrowLeft, CheckCircle2, Smartphone, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { formatINR } from '../utils/formatters';

export default function InvoiceView({ bookingId, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchApi(`/tracking/${bookingId}`)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="py-20 text-center text-slate-400 text-sm">Generating digital invoice...</div>;
  if (!data || !data.booking) return <div className="py-20 text-center text-rose-400 text-sm">Invoice not found for ID {bookingId}</div>;

  const b = data.booking;
  const c = data.checkin;

  return (
    <div className="py-12 bg-navy-900 min-h-screen text-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-6 no-print">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-bold text-xs hover:bg-navy-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF Invoice</span>
          </button>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 font-sans">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                  K
                </div>
                <span className="font-black text-xl text-slate-900 tracking-tight">Kovai Mobile Care Hub</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">100 Feet Road, Power House, Gandhipuram, Coimbatore, TN 641012</p>
              <p className="text-xs text-slate-500">Phone: +91 98765 43210 • GSTIN: 33AAAAA0000A1Z5</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">TAX INVOICE</span>
              <span className="text-lg font-black text-blue-600 font-mono block">{b.id}</span>
              <span className="text-xs text-slate-500 block">Date: {new Date(b.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Customer & Device Information */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Customer Details</span>
              <span className="font-bold text-slate-900 block text-sm">{b.customer_name}</span>
              <span className="text-slate-600 block">{b.customer_phone}</span>
              <span className="text-slate-600 block">{b.customer_email}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Device Details</span>
              <span className="font-bold text-slate-900 block text-sm">{b.brand} {b.model}</span>
              <span className="text-slate-600 block">Delivery: {b.service_type}</span>
              <span className="text-slate-600 font-mono block">IMEI: {c?.imei || 'Recorded in System'}</span>
            </div>
          </div>

          {/* Itemized Services & Charges Table */}
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Service / Item Description</th>
                <th className="p-3 text-center">Part Quality Grade</th>
                <th className="p-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-3">
                  <span className="font-bold text-slate-900 block">{b.service_name}</span>
                  <span className="text-[11px] text-slate-500">{b.problem}</span>
                </td>
                <td className="p-3 text-center font-bold">{b.part_quality}</td>
                <td className="p-3 text-right font-bold">{formatINR(b.total_amount)}</td>
              </tr>

              {b.discount_amount > 0 && (
                <tr className="bg-amber-50">
                  <td className="p-3 font-bold text-amber-800" colSpan={2}>
                    🎉 First Repair Offer / Promotional Discount
                  </td>
                  <td className="p-3 text-right font-bold text-amber-800">
                    -{formatINR(b.discount_amount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs border-t border-slate-200 pt-3">
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-300">
                <span>Total Amount Paid</span>
                <span className="text-blue-600 font-mono">{formatINR(b.final_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Payment Status</span>
                <span className="text-emerald-600 font-bold uppercase">{b.payment_status} ({b.payment_method})</span>
              </div>
            </div>
          </div>

          {/* Warranty Footer Note */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Official Shop Warranty: 90 Days Coverage
            </span>
            <p className="text-[11px] text-slate-600">
              This digital invoice serves as proof of original part installation and 90-day warranty card for display & battery replacements at Kovai Mobile Care Hub.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
