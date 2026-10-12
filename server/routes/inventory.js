import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get inventory parts list
router.get('/', (req, res) => {
  const parts = db.prepare(`
    SELECT p.*, s.name as service_name
    FROM inventory_parts p
    LEFT JOIN services s ON p.service_id = s.id
    ORDER BY p.stock_quantity ASC
  `).all();

  const lowStock = parts.filter(p => p.stock_quantity <= p.min_threshold);

  res.json({
    parts,
    lowStockCount: lowStock.length,
    lowStockItems: lowStock
  });
});

// Add / Update Inventory Part (Admin)
router.post('/', (req, res) => {
  const { id, part_name, brand_name, model_name, service_id, stock_quantity, min_threshold, part_cost, quality_tier } = req.body;
  if (id) {
    db.prepare(`
      UPDATE inventory_parts
      SET part_name = ?, brand_name = ?, model_name = ?, service_id = ?, stock_quantity = ?, min_threshold = ?, part_cost = ?, quality_tier = ?
      WHERE id = ?
    `).run(part_name, brand_name, model_name, service_id, stock_quantity, min_threshold, part_cost, quality_tier, id);
    res.json({ success: true, id });
  } else {
    const result = db.prepare(`
      INSERT INTO inventory_parts (part_name, brand_name, model_name, service_id, stock_quantity, min_threshold, part_cost, quality_tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(part_name, brand_name, model_name, service_id, stock_quantity, min_threshold, part_cost, quality_tier || 'Original');
    res.json({ success: true, id: result.lastInsertRowid });
  }
});

// Delete Inventory Part (Admin)
router.delete('/:id', (req, res) => {
  db.prepare(`DELETE FROM inventory_parts WHERE id = ?`).run(req.params.id);
  res.json({ success: true });
});

export default router;
