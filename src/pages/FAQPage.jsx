import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function FAQPage({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I book a mobile repair in Coimbatore?',
      a: 'You can easily book a repair through our 5-step online booking wizard. Select your mobile brand & model, pick your repair service, select service type (Store Visit, Doorstep in Coimbatore, or Pickup & Delivery), choose date & time slot, and confirm. An instant Booking ID (e.g. MRB-2026-10245) will be generated.'
    },
    {
      q: 'How long does a typical mobile repair take?',
      a: 'Screen and battery replacements are usually completed within 30 to 45 minutes. Micro-soldering, motherboard IC repairs, or ultrasonic water damage treatments take 2 to 4 hours.'
    },
    {
      q: 'How is the repair price calculated?',
      a: 'Prices are transparently calculated based on base service cost, brand/model multiplier, and chosen part grade (Original, OEM, or Compatible). There are no hidden labor fees!'
    },
    {
      q: 'Do you provide doorstep mobile repair in Coimbatore?',
      a: 'Yes! Certified technicians visit your location across Coimbatore areas including Gandhipuram, RS Puram, Peelamedu, Saravanampatti, Singanallur, Saibaba Colony, Ukkadam, Vadavalli, etc.'
    },
    {
      q: 'Do you provide pickup and delivery service?',
      a: 'Yes, our logistics executive picks up your phone from your doorstep, brings it to our Gandhipuram hub for repair, and returns it safely with warranty documentation.'
    },
    {
      q: 'Is warranty available on repair parts?',
      a: 'All original screen and battery replacements come with a 90-Day Official Shop Warranty. We issue a digital GST invoice with complete warranty details.'
    },
    {
      q: 'How can I track my repair progress?',
      a: 'Enter your Booking ID (e.g. MRB-2026-10245) in our "Track Repair" section to view live 8-stage progress (Diagnosis, Repairing, Quality Check, Ready for Delivery).'
    },
    {
      q: 'What is the first booking offer discount?',
      a: 'First-time customers automatically receive 10% OFF on their first repair booking at checkout.'
    },
    {
      q: 'Can I exchange or trade-in my old phone?',
      a: 'Yes! Use our "Old Phone Exchange" calculator to evaluate your pre-owned phone\'s trade-in value and apply trade-in credit toward repair or upgrade.'
    },
    {
      q: 'What happens after physical diagnosis?',
      a: 'Technician conducts physical inspection, logs digital device check-in (screen condition, IMEI, photos), and confirms exact cost before initiating repair work.'
    }
  ];

  return (
    <div className="py-12 bg-navy-900 min-h-screen text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyanAccent text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h1>
          <p className="text-xs sm:text-sm text-slate-300">Find detailed answers about our Coimbatore repair process, warranty, and doorstep services.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:text-cyanAccent transition-colors"
              >
                <span>{faq.q}</span>
                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-cyanAccent" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
