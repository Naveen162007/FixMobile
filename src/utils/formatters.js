// Currency Formatter (INR ₹)
export function formatINR(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Status Color Badge Helper
export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Booking Confirmed':
      return 'bg-blue-900/60 text-blue-300 border-blue-500/30';
    case 'Technician Assigned':
      return 'bg-indigo-900/60 text-indigo-300 border-indigo-500/30';
    case 'Phone Picked Up':
      return 'bg-purple-900/60 text-purple-300 border-purple-500/30';
    case 'Diagnosis':
      return 'bg-yellow-900/60 text-amber-300 border-amber-500/30';
    case 'Repair In Progress':
      return 'bg-cyan-900/60 text-cyan-300 border-cyan-500/30';
    case 'Quality Check':
      return 'bg-teal-900/60 text-teal-300 border-teal-500/30';
    case 'Ready for Delivery':
      return 'bg-emerald-900/60 text-emerald-300 border-emerald-500/30';
    case 'Delivered':
      return 'bg-emerald-900/80 text-emerald-200 border-emerald-400/50';
    case 'Cancelled':
      return 'bg-rose-900/60 text-rose-300 border-rose-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700';
  }
}
