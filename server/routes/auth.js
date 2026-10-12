import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = 'kovai_repair_secret_key_2026';

function hashPassword(pwd) {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

// Register Customer
router.post('/register', (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hash = hashPassword(password);
    const result = db.prepare(`
      INSERT INTO users (name, phone, email, password_hash, role)
      VALUES (?, ?, ?, ?, 'customer')
    `).run(name, phone, email, hash);

    const user = { id: result.lastInsertRowid, name, phone, email, role: 'customer', points: 50 };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: 'Phone or email already registered.' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = hashPassword(password) === user.password_hash;
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const userData = { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, points: user.points };
  const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: userData });
});

// Quick Switch Role (for demo showcase convenience)
router.post('/switch-demo-role', (req, res) => {
  const { role } = req.body;
  let emailTarget = 'admin@kovairepair.in';
  if (role === 'technician') emailTarget = 'suresh@kovairepair.in';
  if (role === 'customer') emailTarget = 'ananya.cbe@gmail.com';

  const user = db.prepare(`SELECT id, name, phone, email, role, points FROM users WHERE email = ?`).get(emailTarget);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

// Get current user profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthenticated' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare(`SELECT id, name, phone, email, role, points FROM users WHERE id = ?`).get(decoded.id);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// List Technicians (for Admin assignment)
router.get('/technicians', (req, res) => {
  const techs = db.prepare(`SELECT id, name, phone, email FROM users WHERE role = 'technician'`).all();
  res.json(techs);
});

export default router;
