import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all brands
router.get('/brands', (req, res) => {
  const brands = db.prepare(`SELECT * FROM brands ORDER BY name ASC`).all();
  res.json(brands);
});

// Add Brand (Admin)
router.post('/brands', (req, res) => {
  const { name, icon } = req.body;
  try {
    const result = db.prepare(`INSERT INTO brands (name, icon) VALUES (?, ?)`).run(name, icon || 'smartphone');
    res.json({ id: result.lastInsertRowid, name, icon });
  } catch (err) {
    res.status(400).json({ error: 'Brand already exists.' });
  }
});

// Get models for brand
router.get('/models', (req, res) => {
  const { brand } = req.query;
  let stmt = `SELECT * FROM models`;
  let params = [];
  if (brand) {
    stmt += ` WHERE brand_name = ?`;
    params.push(brand);
  }
  stmt += ` ORDER BY name ASC`;
  const models = db.prepare(stmt).all(...params);
  res.json(models);
});

// Add Model (Admin)
router.post('/models', (req, res) => {
  const { brand_name, name, image_url, base_multiplier } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO models (brand_name, name, image_url, base_multiplier)
      VALUES (?, ?, ?, ?)
    `).run(brand_name, name, image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80', base_multiplier || 1.0);
    res.json({ id: result.lastInsertRowid, brand_name, name, image_url, base_multiplier });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Services
router.get('/', (req, res) => {
  const services = db.prepare(`SELECT * FROM services ORDER BY id ASC`).all();
  res.json(services);
});

// Add / Edit Service (Admin)
router.post('/', (req, res) => {
  const { id, name, category, explanation, base_price, est_minutes, warranty_days, animation_type } = req.body;
  if (id) {
    db.prepare(`
      UPDATE services
      SET name = ?, category = ?, explanation = ?, base_price = ?, est_minutes = ?, warranty_days = ?, animation_type = ?
      WHERE id = ?
    `).run(name, category, explanation, base_price, est_minutes, warranty_days, animation_type, id);
    res.json({ success: true, id });
  } else {
    const result = db.prepare(`
      INSERT INTO services (name, category, explanation, base_price, est_minutes, warranty_days, animation_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, explanation, base_price, est_minutes, warranty_days || 90, animation_type || 'screen');
    res.json({ success: true, id: result.lastInsertRowid });
  }
});

// Delete Service (Admin)
router.delete('/:id', (req, res) => {
  db.prepare(`DELETE FROM services WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

// Repair Cost Calculator API Endpoint
router.post('/calculate-cost', (req, res) => {
  const { brand, model, service_id, quality } = req.body;

  const service = db.prepare(`SELECT * FROM services WHERE id = ?`).get(service_id);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const modelInfo = db.prepare(`SELECT * FROM models WHERE brand_name = ? AND name = ?`).get(brand, model);
  const multiplier = modelInfo ? modelInfo.base_multiplier : 1.0;

  let qualityMultiplier = 1.0;
  if (quality === 'OEM') qualityMultiplier = 0.75;
  if (quality === 'Compatible') qualityMultiplier = 0.55;

  const estimatedCost = Math.round(service.base_price * multiplier * qualityMultiplier);

  // Check inventory stock status
  const part = db.prepare(`
    SELECT stock_quantity, min_threshold FROM inventory_parts
    WHERE brand_name = ? AND service_id = ? AND quality_tier = ?
  `).get(brand, service_id, quality || 'Original');

  let stockStatus = 'Available';
  let stockBadge = '🟢 Part Available';
  if (!part || part.stock_quantity === 0) {
    stockStatus = 'Unavailable';
    stockBadge = '🔴 Currently Unavailable';
  } else if (part.stock_quantity <= part.min_threshold) {
    stockStatus = 'Low Stock';
    stockBadge = '🟠 Available in 1–2 days';
  }

  res.json({
    brand,
    model,
    service_name: service.name,
    estimatedCost,
    estimatedMinutes: service.est_minutes,
    warrantyDays: service.warranty_days,
    stockStatus,
    stockBadge,
    disclaimer: 'Final price may vary after in-person technician inspection.'
  });
});

export default router;
