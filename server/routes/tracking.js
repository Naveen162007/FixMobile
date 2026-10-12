import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get visual repair timeline & device details by Booking ID
router.get('/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const booking = db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(bookingId);

  if (!booking) {
    return res.status(404).json({ error: 'Booking ID not found. Please check your Booking ID (e.g. MRB-2026-10245).' });
  }

  const checkin = db.prepare(`SELECT * FROM device_checkins WHERE booking_id = ?`).get(bookingId);

  // Timeline steps
  const steps = [
    { title: 'Booking Confirmed', desc: 'Your repair booking has been registered.', minPercent: 12 },
    { title: 'Technician Assigned', desc: 'Expert technician assigned to your device.', minPercent: 25 },
    { title: 'Phone Picked Up', desc: 'Device received at our store / picked up by executive.', minPercent: 38 },
    { title: 'Diagnosis', desc: 'Technician hardware inspection & diagnostic test.', minPercent: 50 },
    { title: 'Repair In Progress', desc: 'Part replacement & micro-soldering under way.', minPercent: 65 },
    { title: 'Quality Check', desc: 'Display calibration, touch, camera & charge testing.', minPercent: 82 },
    { title: 'Ready for Delivery', desc: 'Device sanitized, packaged and ready.', minPercent: 92 },
    { title: 'Delivered', desc: 'Device returned with warranty card & invoice.', minPercent: 100 }
  ];

  res.json({
    booking,
    checkin: checkin || null,
    steps,
    currentStepIndex: steps.findIndex(s => s.minPercent >= booking.progress_percent),
    shopContact: {
      phone: '+91 98765 43210',
      address: '100 Feet Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
      hours: 'Mon - Sun: 9:00 AM - 9:00 PM'
    }
  });
});

export default router;
