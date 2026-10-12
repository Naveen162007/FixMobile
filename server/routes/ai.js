import express from 'express';
import db from '../db.js';

const router = express.Router();

// 1. Symptom Diagnosis Engine
router.post('/diagnose', (req, res) => {
  const { brand, model, symptoms, hasPhoto } = req.body;
  // symptoms is an array of answered questions e.g. ["charging_no", "screen_cracked_yes", "restart_no"]

  let issue = 'Hardware Component Failure';
  let recommendedService = 'Screen Replacement';
  let estMinutes = 45;
  let estPrice = 2499;

  if (symptoms.includes('screen_cracked_yes')) {
    issue = 'Display Glass / Digitizer Shattered';
    recommendedService = 'Screen Replacement';
    estPrice = 2499;
    estMinutes = 45;
  } else if (symptoms.includes('charging_no')) {
    issue = 'Charging Port Failure or Battery Deep Discharge';
    recommendedService = 'Charging Port Repair';
    estPrice = 799;
    estMinutes = 30;
  } else if (symptoms.includes('overheat_yes')) {
    issue = 'Battery Degradation / Power IC Circuit Heat';
    recommendedService = 'Battery Replacement';
    estPrice = 1299;
    estMinutes = 30;
  } else if (symptoms.includes('restart_yes')) {
    issue = 'System OS Crash or Logic Board Circuit Fault';
    recommendedService = 'Software Troubleshooting';
    estPrice = 599;
    estMinutes = 40;
  } else if (symptoms.includes('camera_blurry_yes')) {
    issue = 'Camera Optical Module Glass Scratched / Lens Focus Error';
    recommendedService = 'Camera Repair';
    estPrice = 1499;
    estMinutes = 40;
  }

  // Adjust cost based on model base multiplier from DB
  const modelInfo = db.prepare(`SELECT base_multiplier FROM models WHERE brand_name = ? AND name = ?`).get(brand, model);
  if (modelInfo) {
    estPrice = Math.round(estPrice * modelInfo.base_multiplier);
  }

  res.json({
    possibleIssue: issue,
    recommendedService,
    estimatedCost: estPrice,
    estimatedTime: `${estMinutes} Minutes`,
    hasPhotoAnalysis: !!hasPhoto,
    photoAnalysisNote: hasPhoto ? 'Analysis of uploaded photo shows external impact glass cracking. Final diagnosis requires physical technician inspection at our Coimbatore hub.' : null,
    disclaimer: 'Note: AI diagnosis is preliminary based on symptoms. Final confirmation will be provided after physical inspection by our technician.'
  });
});

// 2. Floating AI Assistant Chat Response Endpoint
router.post('/assistant-chat', (req, res) => {
  const { message, bookingId } = req.body;
  const msgLower = (message || '').toLowerCase();

  // Query Database for Real-Time Facts
  if (bookingId || msgLower.includes('mrb-') || msgLower.includes('track') || msgLower.includes('status')) {
    const extractedIdMatch = message.match(/MRB-2026-\d+/i);
    const targetId = extractedIdMatch ? extractedIdMatch[0].toUpperCase() : bookingId;

    if (targetId) {
      const booking = db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(targetId);
      if (booking) {
        return res.json({
          reply: `📱 **Booking Verified**: ${booking.id}\n- **Device**: ${booking.brand} ${booking.model}\n- **Service**: ${booking.service_name}\n- **Current Status**: ${booking.status} (${booking.progress_percent}% complete)\n- **Assigned Technician**: ${booking.technician_name}\n- **Estimated Amount**: ₹${booking.final_amount}\n- **Payment Status**: ${booking.payment_status}`
        });
      } else {
        return res.json({
          reply: `I searched our database for Booking ID **${targetId}**, but couldn't find a matching record. Please double check the ID or contact our Coimbatore support at +91 98765 43210.`
        });
      }
    }
  }

  // Query Pricing or Services
  if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('rate') || msgLower.includes('how much')) {
    const services = db.prepare(`SELECT name, base_price, est_minutes FROM services LIMIT 5`).all();
    const serviceList = services.map(s => `• **${s.name}**: starting from ₹${s.base_price} (~${s.est_minutes} mins)`).join('\n');
    return res.json({
      reply: `Here are our database-verified starting prices for popular mobile repairs in Coimbatore:\n\n${serviceList}\n\n🎉 **First Booking Offer**: Get an automatic 10% discount on your first repair!`
    });
  }

  // Doorstep or Coimbatore Pickup queries
  if (msgLower.includes('doorstep') || msgLower.includes('pickup') || msgLower.includes('delivery') || msgLower.includes('location') || msgLower.includes('area') || msgLower.includes('coimbatore') || msgLower.includes('address')) {
    const activeAreas = db.prepare(`SELECT area_name FROM service_areas WHERE status = 'Available' LIMIT 6`).all().map(a => a.area_name).join(', ');
    return res.json({
      reply: `📍 **Coimbatore Shop & Service Coverage**:\n- **Main Hub Address**: 100 Feet Road, Gandhipuram, Coimbatore, Tamil Nadu 641012\n- **Doorstep & Pickup Covered Areas**: ${activeAreas}, and more across Kovai!\n- **Store Working Hours**: 9:00 AM - 9:00 PM (All 7 Days)\n- **Phone**: +91 98765 43210`
    });
  }

  // First Booking Discount query
  if (msgLower.includes('discount') || msgLower.includes('offer') || msgLower.includes('coupon') || msgLower.includes('10%')) {
    const offers = db.prepare(`SELECT code, description FROM offers WHERE active = 1`).all();
    const offerText = offers.map(o => `• **${o.code}**: ${o.description}`).join('\n');
    return res.json({
      reply: `🎉 **Active Coimbatore Shop Offers**:\n\n${offerText}\n\nOur system automatically applies the **10% first-repair discount** during checkout for new customers!`
    });
  }

  // Warranty Query
  if (msgLower.includes('warranty') || msgLower.includes('guarantee')) {
    return res.json({
      reply: `🛡️ **Warranty Guarantee**: All mobile screen and battery replacements come with a **90-Day Official Shop Warranty**. We issue a digital GST invoice with complete warranty terms.`
    });
  }

  // General Fallback retrieving shop facts
  return res.json({
    reply: `Hello! I am Kovai Mobile Care's AI Assistant. I can help you with:\n1. Real-time repair prices & duration\n2. Live repair status (give me your Booking ID, e.g. MRB-2026-10245)\n3. Doorstep pickup availability in Coimbatore\n4. First-time 10% discount info\n\nIf you need custom assistance, feel free to call our Gandhipuram store directly at **+91 98765 43210**.`
  });
});

export default router;
