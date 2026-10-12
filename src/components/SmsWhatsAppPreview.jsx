import React from 'react';
import { X, MessageSquare, Bell, Smartphone, Send } from 'lucide-react';

export default function SmsWhatsAppPreview({ isOpen, onClose, notifications = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-pastel border border-sky-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-emerald-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              SMS / WhatsApp API Integration Placeholder
            </span>
          </div>

          <h3 className="text-2xl font-bold">Automated Notifications</h3>
          <p className="text-xs text-emerald-100 mt-1">
            Simulated SMS & WhatsApp gateway dispatch logs for customer repair alerts.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No dispatched SMS notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">{n.title}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">{n.time}</span>
                </div>
                <p className="text-slate-700 font-mono text-[11px] bg-white p-2.5 rounded-xl border border-emerald-100">
                  {n.smsPreview || n.message}
                </p>
                <div className="flex items-center justify-between text-[10px] text-emerald-700 pt-1">
                  <span>API Status: <strong>Delivered (Twilio/WhatsApp Gateway)</strong></span>
                  <span>Ref: {n.bookingId}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          💡 Integrates directly with Twilio, Gupshup, or WhatsApp Business Cloud API.
        </div>

      </div>
    </div>
  );
}
