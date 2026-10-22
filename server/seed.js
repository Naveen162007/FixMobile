import { initDB, writeDB, closeDB } from './db.js';

export const initialSeedData = {
  shopDetails: {
    name: "FixMobile Repair & Service Hub",
    tagline: "Fast, Reliable & Transparent Mobile Repairs",
    logo: "📱 FixMobile",
    phone: "+91 98765 43210",
    email: "support@fixmobile.com",
    address: "104, Tech Park Road, Near Central Mall, Sector 4",
    city: "Metropolis",
    pincode: "641001",
    workingHours: "Mon - Sat: 9:30 AM - 8:30 PM | Sun: 10:00 AM - 4:00 PM",
    holidays: "National Holidays",
    pickupAvailable: true,
    doorstepAvailable: true,
    basePickupFee: 150,
    baseDoorstepFee: 250,
    activeDiscountPercent: 10,
    warrantyMonths: 6,
    announcement: "⚡ 10% Discount on Screen & Battery Replacements this week! Free Doorstep Pickup."
  },

  admins: [
    {
      id: "admin-1",
      email: "admin@fixmobile.com",
      passwordHash: "admin123", // For demo auth
      name: "Shop Manager",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    }
  ],

  users: [
    {
      id: "usr-101",
      name: "John Doe",
      email: "john@example.com",
      phone: "+91 98765 11111",
      passwordHash: "user123",
      role: "user",
      address: "45, Blossom Apartments, Sector 2",
      createdAt: "2026-09-01T10:00:00.000Z"
    },
    {
      id: "usr-102",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 22222",
      passwordHash: "user123",
      role: "user",
      address: "12, Green Avenue, Sector 5",
      createdAt: "2026-09-10T14:30:00.000Z"
    }
  ],

  brands: [
    { id: "b1", name: "Apple", icon: "🍎", models: ["iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro", "iPhone 13", "iPhone 12", "iPhone 11"] },
    { id: "b2", name: "Samsung", icon: "📱", models: ["Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23", "Galaxy A54 5G", "Galaxy Z Flip 5", "Galaxy M34"] },
    { id: "b3", name: "OnePlus", icon: "🔴", models: ["OnePlus 12", "OnePlus 12R", "OnePlus 11 5G", "OnePlus Nord 3", "OnePlus Nord CE 3", "OnePlus 10 Pro"] },
    { id: "b4", name: "Xiaomi", icon: "🟠", models: ["Xiaomi 14", "Redmi Note 13 Pro+", "Redmi Note 13", "POCO X6 Pro", "Redmi 12 5G"] },
    { id: "b5", name: "Vivo", icon: "🔵", models: ["Vivo V30 Pro", "Vivo V29", "Vivo Y200e 5G", "Vivo X100 Pro"] },
    { id: "b6", name: "Oppo", icon: "🟢", models: ["Oppo Reno 11 Pro", "Oppo F25 Pro 5G", "Oppo A79 5G"] },
    { id: "b7", name: "Realme", icon: "🟡", models: ["Realme 12 Pro+ 5G", "Realme GT 5 Pro", "Realme Narzo 60"] },
    { id: "b8", name: "Google", icon: "⚪", models: ["Pixel 8 Pro", "Pixel 8", "Pixel 7a", "Pixel 6a"] }
  ],

  repairServices: [
    { id: "srv-1", category: "Screen Damage", label: "Display / Touch Screen Replacement", basePartCost: 2499, labourCost: 500, timeEst: "1 - 2 Hours", popular: true, icon: "Smartphone" },
    { id: "srv-2", category: "Battery Problem", label: "Battery Replacement & Calibration", basePartCost: 1299, labourCost: 300, timeEst: "45 Mins", popular: true, icon: "BatteryCharging" },
    { id: "srv-3", category: "Charging Port", label: "Charging Connector / Port Repair", basePartCost: 699, labourCost: 300, timeEst: "1 Hour", popular: false, icon: "Zap" },
    { id: "srv-4", category: "Camera Problem", label: "Front / Rear Camera Lens & Sensor Repair", basePartCost: 1899, labourCost: 400, timeEst: "1.5 Hours", popular: false, icon: "Camera" },
    { id: "srv-5", category: "Speaker/Microphone", label: "Earpiece, Mic & Loudspeaker Fix", basePartCost: 799, labourCost: 300, timeEst: "1 Hour", popular: false, icon: "Volume2" },
    { id: "srv-6", category: "Software Problem", label: "OS Flashing, Bootloop & Unlocking", basePartCost: 0, labourCost: 499, timeEst: "2 Hours", popular: false, icon: "Cpu" },
    { id: "srv-7", category: "Water Damage", label: "Chemical Ultrasonic De-oxidation & Board Fix", basePartCost: 999, labourCost: 600, timeEst: "3 - 5 Hours", popular: true, icon: "Droplets" },
    { id: "srv-8", category: "Back Glass Damage", label: "Laser Back Glass Replacement", basePartCost: 1199, labourCost: 400, timeEst: "2 Hours", popular: false, icon: "Shield" },
    { id: "srv-9", category: "Other Problem", label: "General Motherboard & Component Diagnosis", basePartCost: 299, labourCost: 200, timeEst: "Depends on Diagnosis", popular: false, icon: "Wrench" }
  ],

  timeSlots: [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "04:00 PM - 05:00 PM",
    "06:00 PM - 07:00 PM"
  ],

  technicians: [
    { id: "tech-1", name: "Rajesh Kumar", phone: "+91 94444 12345", spec: "Screen & Glass Expert", status: "Available", activeJobs: 1, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120" },
    { id: "tech-2", name: "Anish Varma", phone: "+91 94444 23456", spec: "Motherboard & Water Damage Specialist", status: "Available", activeJobs: 2, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120" },
    { id: "tech-3", name: "Suresh Babu", phone: "+91 94444 34567", spec: "Battery & Charging Module Tech", status: "On Field", activeJobs: 1, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" },
    { id: "tech-4", name: "Kavitha R", phone: "+91 94444 45678", spec: "Software & Chip-level Technician", status: "Available", activeJobs: 0, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120" }
  ],

  inventory: [
    { id: "inv-1", name: "iPhone 13 Original OLED Display", brand: "Apple", model: "iPhone 13", quantity: 4, reorderLevel: 5, price: 3499, supplier: "iTech Spare Wholesale", status: "Low Stock" },
    { id: "inv-2", name: "Samsung S23 High Capacity Battery", brand: "Samsung", model: "Galaxy S23", quantity: 18, reorderLevel: 5, price: 1499, supplier: "SamParts Dist", status: "In Stock" },
    { id: "inv-3", name: "OnePlus 11 USB-C Port Assembly", brand: "OnePlus", model: "OnePlus 11 5G", quantity: 12, reorderLevel: 3, price: 799, supplier: "Express Spares Ltd", status: "In Stock" },
    { id: "inv-4", name: "iPhone 14 Laser Back Glass (Black)", brand: "Apple", model: "iPhone 14", quantity: 2, reorderLevel: 4, price: 1299, supplier: "iTech Spare Wholesale", status: "Low Stock" },
    { id: "inv-5", name: "Redmi Note 13 Pro Touch Digitizer", brand: "Xiaomi", model: "Redmi Note 13 Pro+", quantity: 25, reorderLevel: 8, price: 1899, supplier: "MiParts Co.", status: "In Stock" },
    { id: "inv-6", name: "Universal Waterproof Sealing Adhesive", brand: "All", model: "Universal", quantity: 45, reorderLevel: 10, price: 199, supplier: "FixTool Spares", status: "In Stock" }
  ],

  bookings: [
    {
      bookingId: "MRB10245",
      userId: "usr-101",
      customerName: "John Doe",
      phone: "+91 98765 11111",
      email: "john@example.com",
      brand: "Apple",
      model: "iPhone 13",
      category: "Screen Damage",
      problemDescription: "Top corner of display is cracked and touch unresponsive in upper section.",
      photoUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=300",
      date: "2026-09-29",
      timeSlot: "10:00 AM - 11:00 AM",
      serviceMethod: "Pickup & Delivery",
      address: "45, Blossom Apartments, Sector 2",
      partCost: 2999,
      labourCost: 500,
      pickupFee: 150,
      discount: 350,
      totalCost: 3299,
      finalCost: 4099,
      assignedTechId: "tech-1",
      techName: "Rajesh Kumar",
      status: "Diagnosing",
      additionalCostRequest: {
        amount: 800,
        reason: "Discovered damaged ear speaker flex cable during internal inspection.",
        status: "Pending" // Pending, Approved, Rejected
      },
      diagnosticNotes: "OLED display glass replacement required. Speaker flex wire requires re-soldering.",
      createdAt: "2026-09-28T09:15:00.000Z",
      paymentStatus: "Pending"
    },
    {
      bookingId: "MRB10246",
      userId: "usr-102",
      customerName: "Priya Sharma",
      phone: "+91 98765 22222",
      email: "priya@example.com",
      brand: "Samsung",
      model: "Galaxy S23",
      category: "Battery Problem",
      problemDescription: "Battery drains completely within 3 hours of charging.",
      photoUrl: "",
      date: "2026-09-29",
      timeSlot: "02:00 PM - 03:00 PM",
      serviceMethod: "Doorstep Service",
      address: "12, Green Avenue, Sector 5",
      partCost: 1499,
      labourCost: 300,
      pickupFee: 250,
      discount: 200,
      totalCost: 1849,
      finalCost: 1849,
      assignedTechId: "tech-3",
      techName: "Suresh Babu",
      status: "Booked",
      additionalCostRequest: null,
      diagnosticNotes: "Scheduled for doorstep battery swap.",
      createdAt: "2026-09-28T14:20:00.000Z",
      paymentStatus: "Pending"
    },
    {
      bookingId: "MRB10240",
      userId: "usr-101",
      customerName: "John Doe",
      phone: "+91 98765 11111",
      email: "john@example.com",
      brand: "OnePlus",
      model: "OnePlus 11 5G",
      category: "Charging Port",
      problemDescription: "Cable feels loose and phone only charges at specific angle.",
      photoUrl: "",
      date: "2026-09-25",
      timeSlot: "11:00 AM - 12:00 PM",
      serviceMethod: "Visit Repair Shop",
      address: "FixMobile Central Shop",
      partCost: 799,
      labourCost: 300,
      pickupFee: 0,
      discount: 100,
      totalCost: 999,
      finalCost: 999,
      assignedTechId: "tech-2",
      techName: "Anish Varma",
      status: "Delivered",
      additionalCostRequest: null,
      diagnosticNotes: "Replaced charging flex connector and tested SuperVOOC fast charging.",
      createdAt: "2026-09-25T10:00:00.000Z",
      paymentStatus: "Paid"
    }
  ],

  queries: [
    {
      queryId: "QRY1025",
      userId: "usr-101",
      customerName: "John Doe",
      phone: "+91 98765 11111",
      category: "Repair Issue",
      subject: "Screen repair warranty coverage inquiry",
      message: "Does the 6-month warranty cover accidental liquid contact after display replacement?",
      status: "Replied",
      response: "Hi John, our 6-month warranty covers touch responsiveness & display defect bugs. Physical or liquid damage after repair is excluded from standard warranty.",
      createdAt: "2026-09-27T11:00:00.000Z",
      repliedAt: "2026-09-27T12:30:00.000Z"
    }
  ],

  reviews: [
    { id: "rev-1", name: "Anand R", rating: 5, comment: "Replaced my iPhone 14 screen at my doorstep in 45 mins! Extremely smooth service.", date: "2 days ago", device: "iPhone 14" },
    { id: "rev-2", name: "Meera Nair", rating: 5, comment: "Transparent pricing and genuine battery replacement for Samsung S22. Highly recommended.", date: "5 days ago", device: "Samsung S22" },
    { id: "rev-3", name: "Karthik M", rating: 5, comment: "Fixed water damage issue when other shops gave up. Great technical expertise!", date: "1 week ago", device: "OnePlus 10 Pro" }
  ],

  notifications: [
    {
      id: "notif-1",
      userId: "usr-101",
      bookingId: "MRB10245",
      title: "Diagnosis In Progress",
      message: "Your iPhone 13 (MRB10245) is currently being diagnosed by technician Rajesh Kumar.",
      time: "2 hours ago",
      smsPreview: "[FixMobile] Update for Booking MRB10245: Technician Rajesh is currently diagnosing your iPhone 13. Track status at fixmobile.com/track",
      read: false
    }
  ]
};

export async function seed() {
  await initDB(initialSeedData);
  await writeDB(initialSeedData);
  console.log("Database initialized with FixMobile seed data.");
  await closeDB();
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed();
}

