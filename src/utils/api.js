const API_BASE = 'https://fixmobile-api.onrender.com/api';

export async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Server request failed');
    }
    return data;
  } catch (err) {
    console.warn(`API call failed for ${endpoint}, returning fallback:`, err.message);
    throw err;
  }
}

export const api = {
  getShopDetails: () => fetchApi('/shop-details'),
  updateShopDetails: (data) => fetchApi('/shop-details', { method: 'PUT', body: JSON.stringify(data) }),

  getBrands: () => fetchApi('/brands'),
  getServices: () => fetchApi('/services'),
  getTimeSlots: () => fetchApi('/time-slots'),
  getReviews: () => fetchApi('/reviews'),

  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/bookings${query ? `?${query}` : ''}`);
  },
  getBookingById: (id) => fetchApi(`/bookings/${id}`),
  createBooking: (bookingData) => fetchApi('/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
  updateBooking: (id, updates) => fetchApi(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  respondExtraCost: (id, action) => fetchApi(`/bookings/${id}/extra-cost/respond`, { method: 'POST', body: JSON.stringify({ action }) }),

  getQueries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/queries${query ? `?${query}` : ''}`);
  },
  createQuery: (data) => fetchApi('/queries', { method: 'POST', body: JSON.stringify(data) }),
  replyQuery: (id, data) => fetchApi(`/queries/${id}/reply`, { method: 'PATCH', body: JSON.stringify(data) }),

  getTechnicians: () => fetchApi('/technicians'),
  createTechnician: (data) => fetchApi('/technicians', { method: 'POST', body: JSON.stringify(data) }),
  updateTechnician: (id, data) => fetchApi(`/technicians/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTechnician: (id) => fetchApi(`/technicians/${id}`, { method: 'DELETE' }),

  getInventory: () => fetchApi('/inventory'),
  createInventory: (data) => fetchApi('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  updateInventory: (id, data) => fetchApi(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  getCustomers: () => fetchApi('/customers'),
  getNotifications: () => fetchApi('/notifications'),
  getAnalytics: () => fetchApi('/analytics'),
  diagnoseAi: (prompt) => fetchApi('/ai/diagnose', { method: 'POST', body: JSON.stringify({ prompt }) })
};
