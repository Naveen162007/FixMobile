import express from 'express';
import db from '../db.js';

const router = express.Router();

// Helper to generate Booking ID (MRB-2026-XXXXX)
function generateBookingId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `MRB-2026-${randomNum}`;
}

// Check first booking eligibility for customer
router.get('/check-first-booking', (req, res) => {
  const { email, phone } = req.query;
  if (!email && !phone) return res.json({ isEligible: true });

  const existing = db.prepare(`
    SELECT COUNT(*) as count FROM bookings
    WHERE customer_email = ? OR customer_phone = ?
  `).get(email || '', phone || '');

  res.json({ isEligible: existing.count === 0 });
});

// Create new repair booking
router.post('/', (req, res) => {
  const {
    customer_id, customer_name, customer_phone, customer_email,
    brand, model, problem, service_id, service_name, service_type, service_area,
    part_quality, is_express, scheduled_date, scheduled_time, address, notes,
    problem_photo, coupon_code
  } = req.body;

  if (!customer_name || !customer_phone || !customer_email || !brand || !model || !service_name) {
    return res.status(400).json({ error: 'Missing required booking information.' });
  }

  // 1. Calculate Base Price
  const service = db.prepare(`SELECT * FROM services WHERE name = ? OR id = ?`).get(service_name, service_id);
  const basePrice = service ? service.base_price : 1499;

  const modelInfo = db.prepare(`SELECT base_multiplier FROM models WHERE brand_name = ? AND name = ?`).get(brand, model);
  const multiplier = modelInfo ? modelInfo.base_multiplier : 1.0;

  let qualityMultiplier = 1.0;
  if (part_quality === 'OEM') qualityMultiplier = 0.75;
  if (part_quality === 'Compatible') qualityMultiplier = 0.55;

  let calculatedTotal = Math.round(basePrice * multiplier * qualityMultiplier);

  // Add express fee if selected
  if (is_express) {
    calculatedTotal += 299;
  }

  // Add doorstep fee if selected
  if (service_type === 'Doorstep' || service_type === 'Pickup & Delivery') {
    calculatedTotal += 149;
  }

  // 2. Check First Booking 10% Discount Eligibility
  let discountAmount = 0;
  const existingBookings = db.prepare(`
    SELECT COUNT(*) as count FROM bookings
    WHERE customer_email = ? OR customer_phone = ?
  `).get(customer_email, customer_phone);

  let isFirstBooking = existingBookings.count === 0;

  if (isFirstBooking) {
    discountAmount = Math.round(calculatedTotal * 0.10);
  } else if (coupon_code) {
    const offer = db.prepare(`SELECT * FROM offers WHERE code = ? AND active = 1`).get(coupon_code.toUpperCase());
    if (offer && calculatedTotal >= offer.min_spend) {
      discountAmount = Math.round((calculatedTotal * offer.discount_percentage) / 100);
    }
  }

  const finalAmount = calculatedTotal - discountAmount;
  const bookingId = generateBookingId();

  // Auto assign technician (round robin or default tech)
  const defaultTech = db.prepare(`SELECT id, name FROM users WHERE role = 'technician' LIMIT 1`).get();
  const techId = defaultTech ? defaultTech.id : null;
  const techName = defaultTech ? defaultTech.name : 'Unassigned Tech';

  const insertStmt = db.prepare(`
    INSERT INTO bookings (
      id, customer_id, customer_name, customer_phone, customer_email,
      brand, model, problem, service_id, service_name, service_type, service_area,
      part_quality, is_express, scheduled_date, scheduled_time, address, notes, problem_photo,
      status, progress_percent, total_amount, discount_amount, final_amount,
      payment_status, technician_id, technician_name
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      'Booking Confirmed', 12, ?, ?, ?,
      'Pending', ?, ?
    )
  `);

  insertStmt.run(
    bookingId, customer_id || null, customer_name, customer_phone, customer_email,
    brand, model, problem || service_name, service ? service.id : null, service_name, service_type || 'Visit Store', service_area || 'Gandhipuram',
    part_quality || 'Original', is_express ? 1 : 0, scheduled_date || 'Today', scheduled_time || '10:00 AM', address || 'Store Visit', notes || '', problem_photo || null,
    calculatedTotal, discountAmount, finalAmount,
    techId, techName
  );

  // Create empty digital device check-in record linked to this booking
  db.prepare(`
    INSERT INTO device_checkins (booking_id, screen_condition, body_condition, camera_condition, scratches_notes, accessories, imei)
    VALUES (?, 'Pending Tech Inspection', 'Pending Tech Inspection', 'Pending Tech Inspection', 'None recorded', 'Phone unit only', 'Pending IMEI')
  `).run(bookingId);

  // Notify customer
  db.prepare(`
    INSERT INTO notifications (user_id, booking_id, title, message)
    VALUES (?, ?, 'Booking Confirmed 🎉', ?)
  `).run(customer_id || null, bookingId, `Your repair booking ${bookingId} for ${brand} ${model} is confirmed! Estimated total: ₹${finalAmount}`);

  res.json({
    success: true,
    bookingId,
    booking: {
      id: bookingId,
      customer_name,
      brand,
      model,
      service_name,
      service_type,
      total_amount: calculatedTotal,
      discount_amount: discountAmount,
      isFirstBookingDiscount: isFirstBooking,
      final_amount: finalAmount,
      scheduled_date,
      scheduled_time,
      status: 'Booking Confirmed'
    }
  });
});

// List Bookings (filter by customer, technician, status)
router.get('/', (req, res) => {
  const { customer_id, customer_email, technician_id, status, role } = req.query;
  let stmt = `SELECT * FROM bookings WHERE 1=1`;
  let params = [];

  if (customer_id) {
    stmt += ` AND customer_id = ?`;
    params.push(customer_id);
  } else if (customer_email) {
    stmt += ` AND customer_email = ?`;
    params.push(customer_email);
  }

  if (technician_id) {
    stmt += ` AND technician_id = ?`;
    params.push(technician_id);
  }

  if (status) {
    stmt += ` AND status = ?`;
    params.push(status);
  }

  stmt += ` ORDER BY created_at DESC`;

  const list = db.prepare(stmt).all(...params);
  res.json(list);
});

// Update Booking Status / Technician Assignment (Admin / Tech)
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, progress_percent, technician_id, technician_name, payment_status, payment_method } = req.body;

  const current = db.prepare(`SELECT * FROM bookings WHERE id = ?`).get(id);
  if (!current) return res.status(404).json({ error: 'Booking not found' });

  let newStatus = status || current.status;
  let newProgress = progress_percent !== undefined ? progress_percent : current.progress_percent;
  let newTechId = technician_id !== undefined ? technician_id : current.technician_id;
  let newTechName = technician_name !== undefined ? technician_name : current.technician_name;
  let newPaymentStatus = payment_status || current.payment_status;
  let newPaymentMethod = payment_method || current.payment_method;

  // Auto calculate progress percentage based on status string if not explicitly passed
  if (status && progress_percent === undefined) {
    const statusMap = {
      'Booking Confirmed': 12,
      'Technician Assigned': 25,
      'Phone Picked Up': 38,
      'Diagnosis': 50,
      'Repair In Progress': 65,
      'Quality Check': 82,
      'Ready for Delivery': 92,
      'Delivered': 100,
      'Cancelled': 0
    };
    newProgress = statusMap[status] || current.progress_percent;
  }

  db.prepare(`
    UPDATE bookings
    SET status = ?, progress_percent = ?, technician_id = ?, technician_name = ?, payment_status = ?, payment_method = ?
    WHERE id = ?
  `).run(newStatus, newProgress, newTechId, newTechName, newPaymentStatus, newPaymentMethod, id);

  // Send notification to customer
  db.prepare(`
    INSERT INTO notifications (user_id, booking_id, title, message)
    VALUES (?, ?, ?, ?)
  `).run(current.customer_id, id, `Repair Status Update: ${newStatus}`, `Your repair for ${current.brand} ${current.model} is now '${newStatus}' (${newProgress}% complete).`);

  res.json({ success: true, id, status: newStatus, progress_percent: newProgress });
});

// Digital Device Check-In Details Update (Technician)
router.post('/:id/checkin', (req, res) => {
  const { id } = req.params;
  const { screen_condition, body_condition, camera_condition, scratches_notes, accessories, imei, before_photo, after_photo, technician_notes } = req.body;

  db.prepare(`
    INSERT INTO device_checkins (booking_id, screen_condition, body_condition, camera_condition, scratches_notes, accessories, imei, before_photo, after_photo, technician_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(booking_id) DO UPDATE SET
      screen_condition = excluded.screen_condition,
      body_condition = excluded.body_condition,
      camera_condition = excluded.camera_condition,
      scratches_notes = excluded.scratches_notes,
      accessories = excluded.accessories,
      imei = excluded.imei,
      before_photo = COALESCE(excluded.before_photo, device_checkins.before_photo),
      after_photo = COALESCE(excluded.after_photo, device_checkins.after_photo),
      technician_notes = excluded.technician_notes,
      updated_at = CURRENT_TIMESTAMP
  `).run(id, screen_condition, body_condition, camera_condition, scratches_notes, accessories, imei, before_photo, after_photo, technician_notes);

  res.json({ success: true });
});

// Submit Customer Review for completed booking
router.post('/:id/review', (req, res) => {
  const { id } = req.params;
  const { customer_name, rating, review_text, photo_url } = req.body;

  db.prepare(`
    INSERT INTO reviews (booking_id, customer_name, rating, review_text, photo_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, customer_name || 'Customer', rating || 5, review_text || 'Great service!', photo_url || null);

  res.json({ success: true });
});

export default router;
