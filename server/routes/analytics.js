import express from 'express';
import db from '../db.js';

const router = express.Router();

// Admin Dashboard Summary KPI metrics & chart data
router.get('/', (req, res) => {
  const totalBookings = db.prepare(`SELECT COUNT(*) as count FROM bookings`).get().count;
  const pending = db.prepare(`SELECT COUNT(*) as count FROM bookings WHERE status IN ('Booking Confirmed', 'Technician Assigned', 'Phone Picked Up')`).get().count;
  const inProgress = db.prepare(`SELECT COUNT(*) as count FROM bookings WHERE status IN ('Diagnosis', 'Repair In Progress', 'Quality Check')`).get().count;
  const completed = db.prepare(`SELECT COUNT(*) as count FROM bookings WHERE status IN ('Ready for Delivery', 'Delivered')`).get().count;
  const cancelled = db.prepare(`SELECT COUNT(*) as count FROM bookings WHERE status = 'Cancelled'`).get().count;

  const totalRevenue = db.prepare(`SELECT COALESCE(SUM(final_amount), 0) as total FROM bookings WHERE payment_status = 'Paid'`).get().total;

  const activeTechnicians = db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'technician'`).get().count;

  const lowStockParts = db.prepare(`SELECT COUNT(*) as count FROM inventory_parts WHERE stock_quantity <= min_threshold`).get().count;

  // Most repaired brands
  const brandStats = db.prepare(`
    SELECT brand, COUNT(*) as count FROM bookings
    GROUP BY brand ORDER BY count DESC LIMIT 5
  `).all();

  // Popular services
  const serviceStats = db.prepare(`
    SELECT service_name, COUNT(*) as count FROM bookings
    GROUP BY service_name ORDER BY count DESC LIMIT 5
  `).all();

  // Recent 6 bookings
  const recentBookings = db.prepare(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 6`).all();

  res.json({
    kpis: {
      totalBookings,
      pending,
      inProgress,
      completed,
      cancelled,
      totalRevenue,
      activeTechnicians,
      lowStockParts
    },
    brandStats,
    serviceStats,
    recentBookings
  });
});

export default router;
