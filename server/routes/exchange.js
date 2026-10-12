import express from 'express';
import db from '../db.js';

const router = express.Router();

// Calculate Old Phone Trade-In Exchange Valuation
router.post('/evaluate', (req, res) => {
  const { brand, model, storage, age_months, condition, screen_ok, battery_ok, is_working } = req.body;

  let baseValue = 12000;
  if (brand === 'Apple') baseValue = 22000;
  if (brand === 'Samsung') baseValue = 16000;
  if (brand === 'OnePlus') baseValue = 15000;

  if (storage === '256GB') baseValue += 2000;
  if (storage === '512GB') baseValue += 4000;

  // Age depreciation
  const ageDepreciation = Math.min((age_months || 12) * 400, baseValue * 0.5);
  baseValue -= ageDepreciation;

  // Condition multipliers
  if (condition === 'Good') baseValue *= 0.85;
  if (condition === 'Fair') baseValue *= 0.70;
  if (condition === 'Needs Repair') baseValue *= 0.50;

  if (!screen_ok) baseValue *= 0.70; // Shattered screen deduction
  if (!battery_ok) baseValue -= 1200;
  if (!is_working) baseValue *= 0.40;

  const estimatedValue = Math.max(Math.round(baseValue), 1500);

  res.json({
    brand,
    model,
    storage,
    estimatedExchangeValue: estimatedValue,
    disclaimer: 'Estimated exchange value is subject to physical hardware verification at our Coimbatore hub or doorstep pickup.'
  });
});

// Submit Exchange Pickup Request
router.post('/request', (req, res) => {
  const { customer_name, customer_phone, brand, model, storage, age_months, condition, screen_ok, battery_ok, is_working, estimated_val } = req.body;

  const result = db.prepare(`
    INSERT INTO exchange_requests (
      customer_name, customer_phone, brand, model, storage, age_months,
      condition, screen_ok, battery_ok, is_working, estimated_val, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending Inspection')
  `).run(customer_name, customer_phone, brand, model, storage, age_months || 12, condition || 'Good', screen_ok ? 1 : 0, battery_ok ? 1 : 0, is_working ? 1 : 0, estimated_val || 5000);

  res.json({ success: true, id: result.lastInsertRowid, message: 'Exchange request registered! Our executive will contact you for doorstep device inspection in Coimbatore.' });
});

export default router;
