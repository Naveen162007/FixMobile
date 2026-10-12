import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react';
import L from 'leaflet';

export default function CoimbatoreMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent duplicate initialization
    if (!mapInstanceRef.current) {
      // Coimbatore Coordinates: 11.0168, 76.9558 (Gandhipuram)
      const coimbatoreLat = 11.0168;
      const coimbatoreLng = 76.9558;

      const map = L.map(mapContainerRef.current, {
        center: [coimbatoreLat, coimbatoreLng],
        zoom: 13,
        scrollWheelZoom: false
      });

      // Dark style OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom Icon for Kovai Repair Shop
      const shopIcon = L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: #2563EB; width: 36px; height: 36px; border-radius: 50%; border: 3px solid #F8FAFC; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(37,99,235,0.8);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      // Add Shop Marker
      const marker = L.marker([coimbatoreLat, coimbatoreLng], { icon: shopIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: sans-serif; color: #0B1220; padding: 4px;">
          <strong style="font-size: 14px; color: #2563EB;">Kovai Mobile Care Hub</strong><br/>
          <span style="font-size: 12px; color: #475569;">100 Feet Road, Gandhipuram<br/>Coimbatore, Tamil Nadu 641012</span><br/>
          <span style="font-size: 11px; color: #16a34a; font-weight: bold;">🟢 Open Today: 9:00 AM - 9:00 PM</span>
        </div>
      `).openPopup();

      // Add Service Coverage Circle Overlay around Coimbatore
      L.circle([coimbatoreLat, coimbatoreLng], {
        color: '#38BDF8',
        fillColor: '#2563EB',
        fillOpacity: 0.15,
        radius: 6500 // 6.5 km radius covering RS Puram, Peelamedu, Saibaba Colony
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section id="coimbatore-map" className="py-16 bg-navy-800/50 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-cyanAccent text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>📍 Serving Coimbatore, Tamil Nadu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Visit Our Main Hub in Gandhipuram
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Located conveniently on 100 Feet Road, Gandhipuram with dedicated parking and customer lounge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive OpenStreetMap Container */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[420px] bg-slate-900">
            <div ref={mapContainerRef} className="w-full h-full min-h-[420px] z-10"></div>
          </div>

          {/* Shop Details Card */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-4">
                🟢 Store Open (All 7 Days)
              </div>

              <h3 className="text-xl font-extrabold text-white mb-4">
                Kovai Mobile Care Hub
              </h3>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Shop Address</span>
                    <span>100 Feet Road, Near Power House, Gandhipuram, Coimbatore, Tamil Nadu 641012</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-cyanAccent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Working Hours</span>
                    <span>Monday – Sunday: 9:00 AM – 9:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Phone Support</span>
                    <span className="text-cyanAccent font-semibold">+91 98765 43210</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Email Support</span>
                    <span>support@kovairepair.in</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href="https://maps.google.com/?q=Gandhipuram+Coimbatore"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions on Google Maps</span>
              </a>

              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Coimbatore Doorstep Pickup & Delivery Active</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
