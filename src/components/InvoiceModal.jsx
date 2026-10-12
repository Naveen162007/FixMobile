import React from 'react';
import { X, Printer, Download, Smartphone, CheckCircle, ShieldCheck } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, booking, shopDetails }) {
  if (!isOpen || !booking) return null;

  const shop = shopDetails || {
    name: "FixMobile Repair & Service Hub",
    phone: "+91 98765 43210",
    email: "support@fixmobile.com",
    address: "104, Tech Park Road, Near Central Mall, Sector 4"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-pastel border border-sky-100 overflow-hidden my-8">
        
        {/* Top Control Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Tax Invoice & Warranty Certificate</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 space-y-6 text-slate-800 text-xs sm:text-sm">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Smartphone className="w-6 h-6 text-brand-600" />
                <span className="text-2xl font-extrabold text-slate-900">
                  Fix<span className="text-brand-600">Mobile</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs">{shop.address}</p>
              <p className="text-xs text-slate-500">{shop.phone} • {shop.email}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">GSTIN: 33AAAAA0000A1Z5</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs">
                OFFICIAL INVOICE
              </span>
              <p className="text-sm font-extrabold text-slate-900 mt-2">Inv #: INV-{booking.bookingId}</p>
              <p className="text-xs text-slate-500">Date: {booking.date}</p>
              <p className="text-xs text-slate-500">Status: <strong className="text-emerald-600 capitalize">{booking.paymentStatus || 'Paid'}</strong></p>
            </div>
          </div>

          {/* Customer & Device Meta */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Billed To</span>
              <p className="font-bold text-slate-800">{booking.customerName}</p>
              <p className="text-slate-600">{booking.phone}</p>
              {booking.address && <p className="text-slate-500 text-xs">{booking.address}</p>}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Device Details</span>
              <p className="font-bold text-slate-800">{booking.brand} {booking.model}</p>
              <p className="text-slate-600">Issue: {booking.category}</p>
              <p className="text-slate-500 text-xs">Booking Ref: {booking.bookingId}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-left text-slate-500 text-[11px] uppercase tracking-wider">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Part Cost</th>
                <th className="py-2 text-right">Labour</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3">
                  <p className="font-bold text-slate-800">{booking.category} Service</p>
                  <p className="text-[11px] text-slate-500">{booking.brand} {booking.model} repair</p>
                </td>
                <td className="py-3 text-right">₹{booking.partCost}</td>
                <td className="py-3 text-right">₹{booking.labourCost}</td>
                <td className="py-3 text-right font-semibold">₹{booking.partCost + booking.labourCost}</td>
              </tr>
              {booking.pickupFee > 0 && (
                <tr>
                  <td className="py-3 font-medium">Logistics ({booking.serviceMethod})</td>
                  <td className="py-3 text-right">-</td>
                  <td className="py-3 text-right">₹{booking.pickupFee}</td>
                  <td className="py-3 text-right font-semibold">₹{booking.pickupFee}</td>
                </tr>
              )}
              {booking.additionalCostRequest?.status === 'Approved' && (
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-slate-800">Approved Diagnostic Extra Component</p>
                    <p className="text-[11px] text-slate-500">{booking.additionalCostRequest.reason}</p>
                  </td>
                  <td className="py-3 text-right">₹{booking.additionalCostRequest.amount}</td>
                  <td className="py-3 text-right">-</td>
                  <td className="py-3 text-right font-semibold">₹{booking.additionalCostRequest.amount}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="border-t border-slate-200 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-right">
              {booking.discount > 0 && (
                <div className="flex justify-between text-emerald-700 text-xs">
                  <span>Special Discount:</span>
                  <span>- ₹{booking.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount Paid:</span>
                <span className="text-brand-700">₹{booking.finalCost || booking.totalCost}</span>
              </div>
            </div>
          </div>

          {/* 6-Month Warranty Card Notice */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>6-Month Repair Warranty Certificate Included</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This repair comes with a 6-Month FixMobile warranty covering touchscreen responsiveness and spare part manufacturing defects. Please present this invoice for warranty service.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
