import express from 'express';
import cors from 'cors';
import { 
  readDB, 
  writeDB, 
  initDB, 
  getCollection, 
  setCollection, 
  addItem, 
  updateItemById, 
  getItemById, 
  deleteItem,
  hashPassword,
  comparePassword,
  isMongoActive,
  normalizeTimeSlot
} from './db.js';
import { initialSeedData } from './seed.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper function to check if DB is empty and seed if necessary
const ensureSeed = async () => {
  const db = readDB();
  if (!db.shopDetails || !db.brands || db.brands.length === 0) {
    await writeDB(initialSeedData);
  }
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storageMode: isMongoActive() ? 'MongoDB Atlas' : 'Local JSON Store',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// SHOP DETAILS & PUBLIC INFO
// -------------------------------------------------------------
app.get('/api/shop-details', (req, res) => {
  const db = readDB();
  res.json(db.shopDetails || initialSeedData.shopDetails);
});

app.put('/api/shop-details', async (req, res) => {
  const db = readDB();
  db.shopDetails = { ...db.shopDetails, ...req.body, updatedAt: new Date().toISOString() };
  await writeDB(db);
  res.json({ success: true, shopDetails: db.shopDetails });
});

app.get('/api/brands', (req, res) => {
  const brands = getCollection('brands');
  res.json(brands.length ? brands : initialSeedData.brands);
});

app.get('/api/services', (req, res) => {
  const services = getCollection('repairServices');
  res.json(services.length ? services : initialSeedData.repairServices);
});

app.get('/api/time-slots', (req, res) => {
  const slots = getCollection('timeSlots');
  const validSlots = Array.isArray(slots) ? slots.map(normalizeTimeSlot).filter(Boolean) : [];
  res.json(validSlots.length ? validSlots : initialSeedData.timeSlots);
});

app.get('/api/reviews', (req, res) => {
  const reviews = getCollection('reviews');
  res.json(reviews);
});

// -------------------------------------------------------------
// AUTHENTICATION (User & Admin)
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All registration fields are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getCollection('users');
  const existing = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists." });
  }

  // Securely hash password using bcrypt
  const hashedPassword = await hashPassword(password);

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash: hashedPassword,
    role: "user",
    address: "",
    createdAt: new Date().toISOString()
  };

  await addItem('users', newUser);
  const { passwordHash, ...userWithoutPass } = newUser;
  res.json({ success: true, token: `mock-user-token-${newUser.id}`, user: userWithoutPass });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (role === 'admin') {
    const admins = getCollection('admins');
    const admin = admins.find(a => a.email && a.email.toLowerCase() === normalizedEmail);
    if (!admin || !(await comparePassword(password, admin.passwordHash))) {
      return res.status(401).json({ error: "Invalid Admin Credentials." });
    }

    // Transparently upgrade legacy plaintext password to bcrypt hash
    if (admin.passwordHash && !admin.passwordHash.startsWith('$2a$') && !admin.passwordHash.startsWith('$2b$')) {
      const upgradedHash = await hashPassword(password);
      await updateItemById('admins', 'id', admin.id, { passwordHash: upgradedHash });
      admin.passwordHash = upgradedHash;
    }

    const { passwordHash, ...adminData } = admin;
    return res.json({ success: true, token: `mock-admin-token-${admin.id}`, user: adminData });
  } else {
    const users = getCollection('users');
    const user = users.find(u => u.email && u.email.toLowerCase() === normalizedEmail);
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Transparently upgrade legacy plaintext password to bcrypt hash
    if (user.passwordHash && !user.passwordHash.startsWith('$2a$') && !user.passwordHash.startsWith('$2b$')) {
      const upgradedHash = await hashPassword(password);
      await updateItemById('users', 'id', user.id, { passwordHash: upgradedHash });
      user.passwordHash = upgradedHash;
    }

    const { passwordHash, ...userData } = user;
    return res.json({ success: true, token: `mock-user-token-${user.id}`, user: userData });
  }
});

// -------------------------------------------------------------
// BOOKINGS MANAGEMENT
// -------------------------------------------------------------
app.get('/api/bookings', (req, res) => {
  const { userId, bookingId } = req.query;
  let bookings = getCollection('bookings');

  if (bookingId) {
    bookings = bookings.filter(b => b.bookingId && b.bookingId.toLowerCase() === bookingId.toLowerCase());
  } else if (userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }

  res.json(bookings);
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = getItemById('bookings', 'bookingId', req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found." });
  }
  res.json(booking);
});

app.post('/api/bookings', async (req, res) => {
  const data = req.body;
  if (!data.customerName || !data.phone || !data.brand || !data.model || !data.category) {
    return res.status(400).json({ error: "Missing required booking details." });
  }

  const bookingId = `MRB${Math.floor(10000 + Math.random() * 90000)}`;
  const newBooking = {
    bookingId,
    userId: data.userId || `guest-${Date.now()}`,
    customerName: data.customerName,
    phone: data.phone,
    email: data.email || "",
    brand: data.brand,
    model: data.model,
    category: data.category,
    problemDescription: data.problemDescription || "",
    photoUrl: data.photoUrl || "",
    date: data.date,
    timeSlot: typeof data.timeSlot === 'string' ? data.timeSlot.trim() : (normalizeTimeSlot(data.timeSlot) || ""),
    serviceMethod: data.serviceMethod || "Visit Repair Shop",
    address: data.address || "",
    partCost: Number(data.partCost || 0),
    labourCost: Number(data.labourCost || 0),
    pickupFee: Number(data.pickupFee || 0),
    discount: Number(data.discount || 0),
    totalCost: Number(data.totalCost || 0),
    finalCost: Number(data.totalCost || 0),
    assignedTechId: null,
    techName: "Unassigned",
    status: "Booked", // Booked -> Picked Up -> Diagnosing -> Repairing -> Quality Check -> Ready -> Delivered
    additionalCostRequest: null,
    diagnosticNotes: "",
    createdAt: new Date().toISOString(),
    paymentStatus: "Pending"
  };

  await addItem('bookings', newBooking);

  // Generate confirmation notification & SMS preview
  const newNotif = {
    id: `notif-${Date.now()}`,
    userId: newBooking.userId,
    bookingId: newBooking.bookingId,
    title: "Booking Confirmed",
    message: `Your repair booking ${newBooking.bookingId} for ${newBooking.brand} ${newBooking.model} (${newBooking.category}) has been confirmed!`,
    time: "Just now",
    smsPreview: `[FixMobile Notification] Booking ${newBooking.bookingId} confirmed for ${newBooking.brand} ${newBooking.model}. Slot: ${newBooking.date} ${newBooking.timeSlot}. Est: ₹${newBooking.totalCost}. Track live at fixmobile.com/track`,
    read: false
  };
  await addItem('notifications', newNotif);

  res.json({ success: true, booking: newBooking, notification: newNotif });
});

// Admin updates booking (status, assigned technician, notes, extra cost request)
app.patch('/api/bookings/:id', async (req, res) => {
  const { status, assignedTechId, techName, diagnosticNotes, additionalCost, paymentStatus } = req.body;
  const bookingId = req.params.id;

  const existing = getItemById('bookings', 'bookingId', bookingId);
  if (!existing) {
    return res.status(404).json({ error: "Booking not found." });
  }

  const updates = {};
  if (status) updates.status = status;
  if (assignedTechId) updates.assignedTechId = assignedTechId;
  if (techName) updates.techName = techName;
  if (diagnosticNotes !== undefined) updates.diagnosticNotes = diagnosticNotes;
  if (paymentStatus) updates.paymentStatus = paymentStatus;

  if (additionalCost) {
    // Admin adding extra cost request
    const addAmt = Number(additionalCost.amount || 0);
    updates.additionalCostRequest = {
      amount: addAmt,
      reason: additionalCost.reason || "Additional component replacement required.",
      status: "Pending"
    };

    // Create notification
    await addItem('notifications', {
      id: `notif-${Date.now()}`,
      userId: existing.userId,
      bookingId: existing.bookingId,
      title: "Action Required: Additional Repair Cost",
      message: `Technician requests ₹${addAmt} extra for ${existing.bookingId}: ${additionalCost.reason}`,
      time: "Just now",
      smsPreview: `[FixMobile Alert] Additional repair cost request for ${existing.bookingId}: ₹${addAmt}. Reason: ${additionalCost.reason}. Please approve or reject in your dashboard.`,
      read: false
    });
  }

  const updatedBooking = await updateItemById('bookings', 'bookingId', bookingId, updates);
  res.json({ success: true, booking: updatedBooking });
});

// Customer responds to extra cost request (Approve or Reject)
app.post('/api/bookings/:id/extra-cost/respond', async (req, res) => {
  const { action } = req.body; // 'approve' or 'reject'
  const bookingId = req.params.id;

  const booking = getItemById('bookings', 'bookingId', bookingId);
  if (!booking || !booking.additionalCostRequest) {
    return res.status(400).json({ error: "No active additional cost request found for this booking." });
  }

  const addReq = booking.additionalCostRequest;
  if (action === 'approve') {
    addReq.status = 'Approved';
    const newFinal = Number(booking.totalCost) + Number(addReq.amount);
    await updateItemById('bookings', 'bookingId', bookingId, {
      additionalCostRequest: addReq,
      finalCost: newFinal
    });
  } else {
    addReq.status = 'Rejected';
    await updateItemById('bookings', 'bookingId', bookingId, {
      additionalCostRequest: addReq
    });
  }

  res.json({ success: true, booking: getItemById('bookings', 'bookingId', bookingId) });
});

// -------------------------------------------------------------
// CUSTOMER QUERY / SUPPORT SYSTEM
// -------------------------------------------------------------
app.get('/api/queries', (req, res) => {
  const { userId } = req.query;
  let queries = getCollection('queries');
  if (userId) {
    queries = queries.filter(q => q.userId === userId);
  }
  res.json(queries);
});

app.post('/api/queries', async (req, res) => {
  const { userId, customerName, phone, category, subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: "Subject and message are required." });
  }

  const newQuery = {
    queryId: `QRY${Math.floor(1000 + Math.random() * 9000)}`,
    userId: userId || "guest",
    customerName: customerName || "Customer",
    phone: phone || "",
    category: category || "General Issue",
    subject,
    message,
    status: "Open", // Open -> Replied -> Resolved
    response: "",
    createdAt: new Date().toISOString()
  };

  await addItem('queries', newQuery);
  res.json({ success: true, query: newQuery });
});

app.patch('/api/queries/:id/reply', async (req, res) => {
  const { response, status } = req.body;
  const queryId = req.params.id;

  const existing = getItemById('queries', 'queryId', queryId);
  if (!existing) return res.status(404).json({ error: "Query not found." });

  const updated = await updateItemById('queries', 'queryId', queryId, {
    response: response || existing.response,
    status: status || "Replied",
    repliedAt: new Date().toISOString()
  });

  res.json({ success: true, query: updated });
});

// -------------------------------------------------------------
// TECHNICIAN MANAGEMENT
// -------------------------------------------------------------
app.get('/api/technicians', (req, res) => {
  const techs = getCollection('technicians');
  res.json(techs);
});

app.post('/api/technicians', async (req, res) => {
  const { name, phone, spec, status } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "Name and phone required." });

  const newTech = {
    id: `tech-${Date.now()}`,
    name,
    phone,
    spec: spec || "General Technician",
    status: status || "Available",
    activeJobs: 0,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
  };

  await addItem('technicians', newTech);
  res.json({ success: true, technician: newTech });
});

app.patch('/api/technicians/:id', async (req, res) => {
  const updated = await updateItemById('technicians', 'id', req.params.id, req.body);
  res.json({ success: true, technician: updated });
});

app.delete('/api/technicians/:id', async (req, res) => {
  await deleteItem('technicians', 'id', req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// INVENTORY MANAGEMENT
// -------------------------------------------------------------
app.get('/api/inventory', (req, res) => {
  const inv = getCollection('inventory');
  res.json(inv);
});

app.post('/api/inventory', async (req, res) => {
  const { name, brand, model, quantity, reorderLevel, price, supplier } = req.body;
  if (!name || !quantity || !price) return res.status(400).json({ error: "Part name, quantity, and price required." });

  const qtyNum = Number(quantity);
  const reorderNum = Number(reorderLevel || 5);

  const newInv = {
    id: `inv-${Date.now()}`,
    name,
    brand: brand || "Universal",
    model: model || "Universal",
    quantity: qtyNum,
    reorderLevel: reorderNum,
    price: Number(price),
    supplier: supplier || "Direct Supply",
    status: qtyNum <= reorderNum ? "Low Stock" : "In Stock"
  };

  await addItem('inventory', newInv);
  res.json({ success: true, item: newInv });
});

app.patch('/api/inventory/:id', async (req, res) => {
  const existing = getItemById('inventory', 'id', req.params.id);
  if (!existing) return res.status(404).json({ error: "Inventory item not found." });

  const qty = req.body.quantity !== undefined ? Number(req.body.quantity) : existing.quantity;
  const reorder = req.body.reorderLevel !== undefined ? Number(req.body.reorderLevel) : existing.reorderLevel;

  const updates = {
    ...req.body,
    quantity: qty,
    reorderLevel: reorder,
    status: qty <= reorder ? "Low Stock" : "In Stock"
  };

  const updated = await updateItemById('inventory', 'id', req.params.id, updates);
  res.json({ success: true, item: updated });
});

// -------------------------------------------------------------
// CUSTOMERS & NOTIFICATIONS
// -------------------------------------------------------------
app.get('/api/customers', (req, res) => {
  const users = getCollection('users');
  const bookings = getCollection('bookings');

  const customerList = users.map(u => {
    const userBookings = bookings.filter(b => b.userId === u.id || (u.email && b.email === u.email));
    const totalSpent = userBookings.reduce((sum, b) => sum + (b.paymentStatus === 'Paid' ? (b.finalCost || b.totalCost) : 0), 0);
    const activeRepair = userBookings.find(b => !['Delivered', 'Cancelled'].includes(b.status));

    return {
      ...u,
      totalBookings: userBookings.length,
      totalSpent,
      currentRepair: activeRepair ? `${activeRepair.brand} ${activeRepair.model} (${activeRepair.status})` : 'None',
      bookingHistory: userBookings
    };
  });

  res.json(customerList);
});

app.get('/api/notifications', (req, res) => {
  const notifs = getCollection('notifications');
  res.json(notifs);
});

// -------------------------------------------------------------
// AI REPAIR ASSISTANT API
// -------------------------------------------------------------
app.post('/api/ai/diagnose', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  const text = prompt.toLowerCase();
  let category = "Other Problem";
  let recommendedService = "General Diagnostic Check";
  let estCost = "₹500 - ₹1,500";
  let emergencyAdvice = "Turn off phone and bring it to our repair center for safety inspection.";

  if (text.includes("water") || text.includes("liquid") || text.includes("wet") || text.includes("fell in")) {
    category = "Water Damage";
    recommendedService = "Ultrasonic Chemical Cleaning & De-oxidation";
    estCost = "₹1,499 - ₹2,200";
    emergencyAdvice = "⚠️ CRITICAL: Do NOT plug in charger! Turn phone OFF immediately and do NOT heat with hairdryer. Bring to shop right away.";
  } else if (text.includes("screen") || text.includes("crack") || text.includes("display") || text.includes("touch") || text.includes("black screen")) {
    category = "Screen Damage";
    recommendedService = "Original Touch Digitizer & OLED Display Replacement";
    estCost = "₹2,499 - ₹4,999";
    emergencyAdvice = "Do not press hard on cracked glass to prevent finger cuts or inner panel bleeding.";
  } else if (text.includes("battery") || text.includes("charge drain") || text.includes("shutdown") || text.includes("percentage drop")) {
    category = "Battery Problem";
    recommendedService = "High-Capacity OEM Battery Replacement with 6-Month Warranty";
    estCost = "₹1,299 - ₹1,899";
    emergencyAdvice = "If phone back panel is swelling, stop charging immediately as battery may be expanded.";
  } else if (text.includes("charge") || text.includes("plug") || text.includes("port") || text.includes("loose")) {
    category = "Charging Port";
    recommendedService = "Type-C / Lightning Port Assembly Swap";
    estCost = "₹699 - ₹1,199";
    emergencyAdvice = "Clean lint gently with a dry wooden toothpick. Do not stick metal needles inside port.";
  } else if (text.includes("camera") || text.includes("blur") || text.includes("focus") || text.includes("photo")) {
    category = "Camera Problem";
    recommendedService = "Rear Camera Lens Module Replacement";
    estCost = "₹1,899 - ₹3,500";
    emergencyAdvice = "Avoid exposing camera lens to strong laser beams or magnets.";
  } else if (text.includes("speaker") || text.includes("sound") || text.includes("mic") || text.includes("voice")) {
    category = "Speaker/Microphone";
    recommendedService = "Loudspeaker & Noise-Cancelling Microphone Repair";
    estCost = "₹799 - ₹1,299";
    emergencyAdvice = "Clean speaker mesh with soft brush.";
  } else if (text.includes("slow") || text.includes("boot") || text.includes("hang") || text.includes("password") || text.includes("restart")) {
    category = "Software Problem";
    recommendedService = "Official Firmware Re-flash & System Optimization";
    estCost = "₹499 - ₹799";
    emergencyAdvice = "Ensure you backup photos to cloud if phone reboots intermittently.";
  }

  res.json({
    suggestedCategory: category,
    recommendedService,
    estimatedCostRange: estCost,
    emergencyAdvice,
    aiExplanation: `Based on your description ("${prompt}"), our AI technician believes the primary issue relates to ${category}. We recommend scheduling a ${recommendedService}.`
  });
});

// -------------------------------------------------------------
// ANALYTICS & DASHBOARD METRICS
// -------------------------------------------------------------
app.get('/api/analytics', (req, res) => {
  const bookings = getCollection('bookings');
  const inventory = getCollection('inventory');
  const techs = getCollection('technicians');
  const users = getCollection('users');

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.finalCost || b.totalCost || 0), 0);
  const pendingBookings = bookings.filter(b => b.status === 'Booked').length;
  const activeRepairs = bookings.filter(b => ['Picked Up', 'Diagnosing', 'Repairing', 'Quality Check'].includes(b.status)).length;
  const completedRepairs = bookings.filter(b => ['Ready', 'Delivered'].includes(b.status)).length;
  const lowStockCount = inventory.filter(i => i.quantity <= i.reorderLevel).length;

  res.json({
    metrics: {
      totalBookings: bookings.length,
      pendingBookings,
      activeRepairs,
      completedRepairs,
      totalCustomers: users.length,
      revenue: totalRevenue,
      availableTechs: techs.filter(t => t.status === 'Available').length,
      lowStockItems: lowStockCount
    },
    popularBrands: [
      { name: "Apple", count: 42 },
      { name: "Samsung", count: 35 },
      { name: "OnePlus", count: 22 },
      { name: "Xiaomi", count: 18 },
      { name: "Others", count: 12 }
    ],
    popularIssues: [
      { name: "Screen Damage", count: 48 },
      { name: "Battery Problem", count: 28 },
      { name: "Water Damage", count: 15 },
      { name: "Charging Port", count: 12 },
      { name: "Camera/Software", count: 10 }
    ],
    weeklyBookings: [
      { day: "Mon", bookings: 12, revenue: 14500 },
      { day: "Tue", bookings: 19, revenue: 22100 },
      { day: "Wed", bookings: 15, revenue: 18900 },
      { day: "Thu", bookings: 22, revenue: 29400 },
      { day: "Fri", bookings: 28, revenue: 38200 },
      { day: "Sat", bookings: 32, revenue: 44100 },
      { day: "Sun", bookings: 18, revenue: 21500 }
    ]
  });
});

// -------------------------------------------------------------
// SERVER INITIALIZATION
// -------------------------------------------------------------
const startServer = async () => {
  try {
    await initDB(initialSeedData);
    await ensureSeed();
  } catch (err) {
    console.error('Server DB initialization error:', err);
  }

  app.listen(PORT, () => {
    console.log(`⚡ FixMobile Server running on http://localhost:${PORT}`);
    console.log(`📡 Storage Mode: ${isMongoActive() ? 'MongoDB Atlas (Persistent Cloud)' : 'Local JSON Store'}`);
  });
};

startServer();
