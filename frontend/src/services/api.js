const API_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('sales_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  options: () => request('/dashboard/options'),
  summary: (params) => request(`/dashboard/summary?${new URLSearchParams(params)}`),
  monthly: (params) => request(`/dashboard/monthly?${new URLSearchParams(params)}`),
  categories: (params) => request(`/dashboard/categories?${new URLSearchParams(params)}`),
  regions: (params) => request(`/dashboard/regions?${new URLSearchParams(params)}`),
  topProducts: (params) => request(`/dashboard/products?${new URLSearchParams(params)}`),
  transactions: (params) => request(`/dashboard/transactions?${new URLSearchParams(params)}`),
  products: (params = {}) => request(`/products?${new URLSearchParams(params)}`),
  customers: (params = {}) => request(`/customers?${new URLSearchParams(params)}`),
  orders: (params = {}) => request(`/orders?${new URLSearchParams(params)}`),
  search: (q) => request(`/dashboard/search?q=${encodeURIComponent(q)}`)
};
