import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get Coimbatore service areas list
router.get('/areas', (req, res) => {
  const areas = db.prepare(`SELECT * FROM service_areas ORDER BY area_name ASC`).all();
  res.json(areas);
});

// Check specific location availability in Coimbatore
router.post('/check-availability', (req, res) => {
  const { area_or_pincode } = req.body;
  if (!area_or_pincode) return res.status(400).json({ error: 'Area or pincode required' });

  const query = (area_or_pincode || '').trim().toLowerCase();

  const found = db.prepare(`
    SELECT * FROM service_areas
    WHERE LOWER(area_name) LIKE ? OR pincode = ?
  `).get(`%${query}%`, query);

  if (found && found.status === 'Available') {
    return res.json({
      available: true,
      badge: '🟢 Doorstep Service Available',
      area_name: found.area_name,
      pincode: found.pincode,
      message: `Great news! Doorstep repair and pickup service is fully active in ${found.area_name} (${found.pincode}).`
    });
  } else if (found && found.status === 'Unavailable') {
    return res.json({
      available: false,
      badge: '🟠 Currently Unavailable in this Area',
      area_name: found.area_name,
      pincode: found.pincode,
      message: `Doorstep service is currently out of range for ${found.area_name}. You can still visit our main store at Gandhipuram!`
    });
  } else {
    // Default fallback check for Coimbatore general pincodes starting with 641
    const isCoimbatorePin = query.startsWith('641');
    if (isCoimbatorePin) {
      return res.json({
        available: true,
        badge: '🟢 Doorstep Service Available',
        area_name: `Coimbatore Zone (${query})`,
        pincode: query,
        message: `Doorstep service is available for Coimbatore pincode ${query}.`
      });
    }

    return res.json({
      available: false,
      badge: '🟠 Currently Unavailable in this Area',
      area_name: query,
      pincode: query,
      message: `Location '${query}' is currently outside our immediate doorstep delivery zone. Please visit our Gandhipuram shop or call support!`
    });
  }
});

// Update Service Area status (Admin)
router.post('/areas', (req, res) => {
  const { area_name, pincode, status } = req.body;
  try {
    db.prepare(`
      INSERT INTO service_areas (area_name, pincode, status)
      VALUES (?, ?, ?)
      ON CONFLICT(area_name) DO UPDATE SET status = excluded.status, pincode = excluded.pincode
    `).run(area_name, pincode, status || 'Available');
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Store information details endpoint
router.get('/shop-info', (req, res) => {
  res.json({
    name: 'Kovai Mobile Care Hub',
    tagline: 'Fast, Reliable & Professional Mobile Repairs in Coimbatore',
    phone: '+91 98765 43210',
    email: 'support@kovairepair.in',
    address: '100 Feet Road, Near Power House, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    coordinates: { lat: 11.0168, lng: 76.9558 },
    hours: 'Monday – Sunday: 9:00 AM – 9:00 PM IST',
    googleMapsUrl: 'https://maps.google.com/?q=Gandhipuram+Coimbatore'
  });
});

export default router;
