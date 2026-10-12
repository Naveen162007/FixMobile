import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database_store.json');

// Ensure DB file exists
export function initDB(initialData = {}) {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database_store.json:', err);
    return {};
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to database_store.json:', err);
    return false;
  }
}

export function getCollection(name) {
  const db = readDB();
  return db[name] || [];
}

export function setCollection(name, items) {
  const db = readDB();
  db[name] = items;
  writeDB(db);
}

export function getItemById(name, idKey = 'id', idVal) {
  const items = getCollection(name);
  return items.find(item => String(item[idKey]) === String(idVal));
}

export function updateItemById(name, idKey = 'id', idVal, updates) {
  const items = getCollection(name);
  const index = items.findIndex(item => String(item[idKey]) === String(idVal));
  if (index !== -1) {
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    setCollection(name, items);
    return items[index];
  }
  return null;
}

export function addItem(name, item) {
  const items = getCollection(name);
  items.unshift(item);
  setCollection(name, items);
  return item;
}

export function deleteItem(name, idKey = 'id', idVal) {
  const items = getCollection(name);
  const filtered = items.filter(item => String(item[idKey]) !== String(idVal));
  setCollection(name, filtered);
  return true;
}
