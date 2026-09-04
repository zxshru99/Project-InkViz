import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const clean = envUrl.replace(/\/$/, '');
  return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Automatically inject JWT access token from localStorage into headers
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('inkviz_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error unwrapping
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(errorMsg));
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', credentials);
    if (typeof window !== 'undefined') {
      if (res.data.data?.accessToken) {
        localStorage.setItem('inkviz_access_token', res.data.data.accessToken);
      }
      if (res.data.data?.user) {
        localStorage.setItem('inkviz_user', JSON.stringify(res.data.data.user));
        window.dispatchEvent(new Event('inkviz_auth_changed'));
      }
    }
    return res.data.data;
  },
  register: async (userData: { name: string; email: string; password: string }) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data.data;
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('inkviz_access_token');
      localStorage.removeItem('inkviz_user');
      window.dispatchEvent(new Event('inkviz_auth_changed'));
    }
  },
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('inkviz_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  updateCurrentUser: (userData: { name?: string; email?: string }) => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('inkviz_user');
      const current = stored ? JSON.parse(stored) : {};
      const updated = { ...current, ...userData };
      localStorage.setItem('inkviz_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('inkviz_auth_changed'));
      return updated;
    } catch {
      return null;
    }
  },
};

// Invoices API
export const invoicesApi = {
  list: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get('/invoices', { params });
    return res.data.data;
  },
  get: async (id: string) => {
    const res = await apiClient.get(`/invoices/${id}`);
    return res.data.data.invoice;
  },
  create: async (invoiceData: any) => {
    const res = await apiClient.post('/invoices', invoiceData);
    return res.data.data.invoice;
  },
  update: async (id: string, invoiceData: any) => {
    const res = await apiClient.patch(`/invoices/${id}`, invoiceData);
    return res.data.data.invoice;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/invoices/${id}`);
    return res.data.data;
  },
};

// Clients API
export const clientsApi = {
  list: async (search?: string) => {
    const res = await apiClient.get('/clients', { params: { search } });
    return res.data.data.clients;
  },
  get: async (id: string) => {
    const res = await apiClient.get(`/clients/${id}`);
    return res.data.data.client;
  },
  create: async (clientData: any) => {
    const res = await apiClient.post('/clients', clientData);
    return res.data.data.client;
  },
  update: async (id: string, clientData: any) => {
    const res = await apiClient.patch(`/clients/${id}`, clientData);
    return res.data.data.client;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/clients/${id}`);
    return res.data.data;
  },
};

// Products API
export const productsApi = {
  list: async (params?: { search?: string; type?: string }) => {
    const res = await apiClient.get('/products', { params });
    return res.data.data.products;
  },
  get: async (id: string) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data.product;
  },
  create: async (productData: any) => {
    const res = await apiClient.post('/products', productData);
    return res.data.data.product;
  },
  update: async (id: string, productData: any) => {
    const res = await apiClient.patch(`/products/${id}`, productData);
    return res.data.data.product;
  },
  adjustStock: async (id: string, adjustment: { adjustment?: number; stock?: number; reason?: string }) => {
    const res = await apiClient.post(`/products/${id}/stock`, adjustment);
    return res.data.data.product;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data.data;
  },
};

// Vendors API
export const vendorsApi = {
  list: async (params?: { search?: string; category?: string; status?: string }) => {
    const res = await apiClient.get('/vendors', { params });
    return res.data.data.vendors;
  },
  get: async (id: string) => {
    const res = await apiClient.get(`/vendors/${id}`);
    return res.data.data.vendor;
  },
  create: async (vendorData: any) => {
    const res = await apiClient.post('/vendors', vendorData);
    return res.data.data.vendor;
  },
  update: async (id: string, vendorData: any) => {
    const res = await apiClient.patch(`/vendors/${id}`, vendorData);
    return res.data.data.vendor;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/vendors/${id}`);
    return res.data.data;
  },
};

// Expenses API
export const expensesApi = {
  list: async (params?: { search?: string; category?: string; startDate?: string; endDate?: string; billable?: string }) => {
    const res = await apiClient.get('/expenses', { params });
    return res.data.data.expenses;
  },
  get: async (id: string) => {
    const res = await apiClient.get(`/expenses/${id}`);
    return res.data.data.expense;
  },
  create: async (expenseData: any) => {
    const res = await apiClient.post('/expenses', expenseData);
    return res.data.data.expense;
  },
  update: async (id: string, expenseData: any) => {
    const res = await apiClient.patch(`/expenses/${id}`, expenseData);
    return res.data.data.expense;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/expenses/${id}`);
    return res.data.data;
  },
};

// Quotations API
export const quotationsApi = {
  list: async (params?: { search?: string; status?: string }) => {
    const res = await apiClient.get('/quotations', { params });
    return res.data.data.quotations;
  },
  get: async (id: string) => {
    const res = await apiClient.get(`/quotations/${id}`);
    return res.data.data.quotation;
  },
  create: async (quotationData: any) => {
    const res = await apiClient.post('/quotations', quotationData);
    return res.data.data.quotation;
  },
  update: async (id: string, quotationData: any) => {
    const res = await apiClient.patch(`/quotations/${id}`, quotationData);
    return res.data.data.quotation;
  },
  convert: async (id: string, invoiceId: string) => {
    const res = await apiClient.post(`/quotations/${id}/convert`, { invoiceId });
    return res.data.data.quotation;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/quotations/${id}`);
    return res.data.data;
  },
};
