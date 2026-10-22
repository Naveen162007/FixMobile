import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database_store.json');

let mongoClient = null;
let mongoDb = null;
let isConnectedToMongo = false;

// Known collections stored as documents in MongoDB
export const KNOWN_COLLECTIONS = [
  'admins',
  'users',
  'brands',
  'repairServices',
  'timeSlots',
  'technicians',
  'inventory',
  'bookings',
  'queries',
  'reviews',
  'notifications'
];

// In-memory store for synchronous read access and low-latency cache
let memoryStore = {
  shopDetails: null,
  admins: [],
  users: [],
  brands: [],
  repairServices: [],
  timeSlots: [],
  technicians: [],
  inventory: [],
  bookings: [],
  queries: [],
  reviews: [],
  notifications: []
};

// --- Password Hashing & Verification ---
export async function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, storedHash) {
  if (!storedHash || !plainPassword) return false;
  // If storedHash is a bcrypt hash
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    return bcrypt.compare(plainPassword, storedHash);
  }
  // Fallback for legacy seeded accounts / existing plaintext hashes
  return plainPassword === storedHash;
}

// --- Helper for local disk reading/writing ---
function readDBFromDisk() {
  try {
    if (!fs.existsSync(DB_FILE)) return {};
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database_store.json from disk:', err.message);
    return {};
  }
}

function writeDBToDisk(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    // Non-fatal if filesystem is read-only or ephemeral
    return false;
  }
}

// Strip MongoDB internal _id before saving to memory or returning to callers
function stripMongoId(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const { _id, ...rest } = obj;
  return rest;
}

// --- Database Initialization & Safe Migration ---
export async function initDB(initialData = {}) {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      mongoClient = new MongoClient(mongoUri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });

      await mongoClient.connect();
      mongoDb = mongoClient.db(process.env.MONGODB_DB_NAME || 'fixmobile');
      isConnectedToMongo = true;
      console.log('✅ Connected to MongoDB Atlas successfully.');

      // Source data for one-time initial migration (prefer local json if it exists, otherwise initialData)
      const diskData = readDBFromDisk();
      const sourceData = (diskData && Object.keys(diskData).length > 0) ? diskData : initialData;

      // 1. Safe migration for collections: only migrate if cloud collection is completely empty
      for (const colName of KNOWN_COLLECTIONS) {
        const col = mongoDb.collection(colName);
        const count = await col.countDocuments();

        if (count === 0) {
          const itemsToMigrate = (sourceData[colName] && Array.isArray(sourceData[colName])) ? sourceData[colName] : [];
          if (itemsToMigrate.length > 0) {
            const cleanItems = itemsToMigrate.map(item => {
              const doc = { ...item };
              delete doc._id;
              return doc;
            });
            await col.insertMany(cleanItems);
            console.log(`📦 [Migration] Seeded ${cleanItems.length} initial items into MongoDB collection: "${colName}"`);
          }
        } else {
          console.log(`ℹ️ [Preserved] MongoDB collection "${colName}" already contains ${count} items. Cloud data preserved.`);
        }
      }

      // 2. Safe migration for shopDetails
      const shopCol = mongoDb.collection('shopDetails');
      const existingShop = await shopCol.findOne({});
      if (!existingShop) {
        const initialShop = sourceData.shopDetails || initialData.shopDetails;
        if (initialShop) {
          const cleanShop = { ...initialShop };
          delete cleanShop._id;
          await shopCol.insertOne(cleanShop);
          console.log('📦 [Migration] Seeded shopDetails into MongoDB.');
        }
      } else {
        console.log('ℹ️ [Preserved] MongoDB shopDetails already exists. Cloud data preserved.');
      }

      // 3. Populate memoryStore with the latest data from MongoDB Atlas
      for (const colName of KNOWN_COLLECTIONS) {
        const docs = await mongoDb.collection(colName).find({}, { projection: { _id: 0 } }).toArray();
        memoryStore[colName] = docs;
      }

      const latestShop = await shopCol.findOne({}, { projection: { _id: 0 } });
      if (latestShop) {
        memoryStore.shopDetails = latestShop;
      }

      // Update local file as a local backup
      writeDBToDisk(memoryStore);
      return;
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
      console.warn('⚠️ Falling back to local JSON database storage.');
      isConnectedToMongo = false;
      mongoDb = null;
    }
  } else {
    console.log('ℹ️ MONGODB_URI not configured. Operating in local JSON storage mode.');
  }

  // Fallback / Local Mode: Use local database_store.json
  if (!fs.existsSync(DB_FILE)) {
    writeDBToDisk(initialData);
  }
  const loaded = readDBFromDisk();
  memoryStore = { ...memoryStore, ...loaded };
}

export function isMongoActive() {
  return isConnectedToMongo && mongoDb !== null;
}

export function readDB() {
  return memoryStore;
}

export async function writeDB(data) {
  memoryStore = { ...memoryStore, ...data };

  if (isConnectedToMongo && mongoDb) {
    try {
      if (data.shopDetails) {
        const shopClean = { ...data.shopDetails };
        delete shopClean._id;
        await mongoDb.collection('shopDetails').replaceOne({}, shopClean, { upsert: true });
      }

      for (const colName of KNOWN_COLLECTIONS) {
        if (Array.isArray(data[colName])) {
          await setCollection(colName, data[colName]);
        }
      }
    } catch (err) {
      console.error('Error writing full DB to MongoDB:', err.message);
    }
  }

  writeDBToDisk(memoryStore);
  return true;
}

export function getCollection(name) {
  return memoryStore[name] || [];
}

export async function setCollection(name, items) {
  memoryStore[name] = items;

  if (isConnectedToMongo && mongoDb) {
    try {
      const col = mongoDb.collection(name);
      await col.deleteMany({});
      if (items.length > 0) {
        const cleanItems = items.map(it => {
          const doc = { ...it };
          delete doc._id;
          return doc;
        });
        await col.insertMany(cleanItems);
      }
    } catch (err) {
      console.error(`Error setting collection "${name}" in MongoDB:`, err.message);
    }
  }

  writeDBToDisk(memoryStore);
}

export function getItemById(name, idKey = 'id', idVal) {
  const items = getCollection(name);
  return items.find(item => String(item[idKey]) === String(idVal));
}

export async function updateItemById(name, idKey = 'id', idVal, updates) {
  const items = getCollection(name);
  const index = items.findIndex(item => String(item[idKey]) === String(idVal));

  if (index !== -1) {
    const updated = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    items[index] = updated;

    if (isConnectedToMongo && mongoDb) {
      try {
        const mongoUpdates = { ...updates, updatedAt: updated.updatedAt };
        delete mongoUpdates._id;
        await mongoDb.collection(name).updateOne(
          { [idKey]: String(idVal) },
          { $set: mongoUpdates }
        );
      } catch (err) {
        console.error(`Error updating item ${idVal} in MongoDB collection "${name}":`, err.message);
      }
    }

    writeDBToDisk(memoryStore);
    return items[index];
  }
  return null;
}

export async function addItem(name, item) {
  if (!memoryStore[name]) memoryStore[name] = [];
  memoryStore[name].unshift(item);

  if (isConnectedToMongo && mongoDb) {
    try {
      const doc = { ...item };
      delete doc._id;
      await mongoDb.collection(name).insertOne(doc);
    } catch (err) {
      console.error(`Error adding item into MongoDB collection "${name}":`, err.message);
    }
  }

  writeDBToDisk(memoryStore);
  return item;
}

export async function deleteItem(name, idKey = 'id', idVal) {
  if (memoryStore[name]) {
    memoryStore[name] = memoryStore[name].filter(item => String(item[idKey]) !== String(idVal));
  }

  if (isConnectedToMongo && mongoDb) {
    try {
      await mongoDb.collection(name).deleteOne({ [idKey]: String(idVal) });
    } catch (err) {
      console.error(`Error deleting item ${idVal} from MongoDB collection "${name}":`, err.message);
    }
  }

  writeDBToDisk(memoryStore);
  return true;
}

export async function closeDB() {
  if (mongoClient) {
    await mongoClient.close();
    isConnectedToMongo = false;
    mongoClient = null;
    mongoDb = null;
  }
}
