import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// Axios Instance
// ─────────────────────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Bypass-Tunnel-Reminder": "true",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Request Interceptor — attach auth token
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("lumiere_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────────────────────────────────────
// Response Interceptor — handle 401 & network errors
// ─────────────────────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (!error.response) {
      // Network error
      return Promise.reject(
        new Error("Network error. Please check your connection and try again.")
      );
    }

    const { status, data } = error.response;

    if (status === 401) {
      // Clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("lumiere_token");
        localStorage.removeItem("lumiere_user");
        const currentPath = window.location.pathname;
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
      return Promise.reject(new Error(data?.message ?? "Session expired. Please login again."));
    }

    if (status === 403) {
      return Promise.reject(new Error(data?.message ?? "You do not have permission to perform this action."));
    }

    if (status === 404) {
      return Promise.reject(new Error(data?.message ?? "The requested resource was not found."));
    }

    if (status === 422) {
      return Promise.reject(new Error(data?.message ?? "Validation error. Please check your input."));
    }

    if (status >= 500) {
      return Promise.reject(new Error(data?.message ?? "Server error. Please try again later."));
    }

    return Promise.reject(new Error(data?.message ?? "An unexpected error occurred."));
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Typed API Modules
// ─────────────────────────────────────────────────────────────────────────────

/* ── Auth ───────────────────────────────────────────────────────────────────── */
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post("/auth/register", data),

  logout: () => api.post("/auth/logout"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data),

  verifyEmail: (token: string) =>
    api.post("/auth/verify-email", { token }),

  refreshToken: () => api.post("/auth/refresh-token"),

  getMe: () => api.get("/auth/me"),

  requestAdminOtp: (email: string) =>
    api.post("/auth/admin/forgot-password-otp", { email }),

  resetAdminPasswordWithOtp: (data: { email: string; otp: string; password: string }) =>
    api.post("/auth/admin/reset-password-otp", data),
};

/* ── Menu ───────────────────────────────────────────────────────────────────── */
export const menuApi = {
  getAll: (params?: {
    category?: string;
    search?: string;
    isVeg?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) => api.get("/menu", { params }),

  getBySlug: (slug: string) => api.get(`/menu/${slug}`),

  getById: (id: string) => api.get(`/menu/id/${id}`),

  getFeatured: () => api.get("/menu/featured"),

  getChefSpecials: () => api.get("/menu/chef-specials"),

  getCategories: (params?: { all?: boolean }) => api.get("/menu/categories", { params }),

  search: (query: string) => api.get("/menu/search", { params: { q: query } }),

  // Admin only
  create: (data: FormData) =>
    api.post("/menu", data, { headers: { "Content-Type": "multipart/form-data" } }),

  update: (id: string, data: FormData) =>
    api.put(`/menu/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string) => api.delete(`/menu/${id}`),

  toggleAvailability: (id: string) => api.patch(`/menu/${id}/toggle-availability`),

  createCategory: (data: { name: string; description?: string; sortOrder?: number; isActive?: boolean; image?: string }) =>
    api.post("/menu/categories", data),

  updateCategory: (id: string, data: Partial<{ name: string; description?: string; sortOrder?: number; isActive?: boolean; image?: string }>) =>
    api.put(`/menu/categories/${id}`, data),

  deleteCategory: (id: string) =>
    api.delete(`/menu/categories/${id}`),
};

/* ── Orders ─────────────────────────────────────────────────────────────────── */
export const ordersApi = {
  create: (data: {
    items: Array<{ menuItem: string; quantity: number; customizations?: Record<string, string> }>;
    deliveryAddress?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: string;
    couponCode?: string;
    specialInstructions?: string;
  }) => api.post("/orders", data),

  getMyOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get("/orders/my", { params }),

  getById: (id: string) => api.get(`/orders/${id}`),

  getByOrderNumber: (orderNumber: string) =>
    api.get(`/orders/track/${orderNumber}`),

  cancelOrder: (id: string, reason?: string) =>
    api.patch(`/orders/${id}/cancel`, { reason }),

  reorder: (id: string) => api.post(`/orders/${id}/reorder`),

  // Admin only
  getAll: (params?: { page?: number; limit?: number; status?: string; date?: string }) =>
    api.get("/orders/admin", { params }),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  getStats: (period?: string) => api.get("/orders/stats", { params: { period } }),
};

/* ── Reservations ───────────────────────────────────────────────────────────── */
export const reservationsApi = {
  create: (data: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    occasion?: string;
    specialRequests?: string;
  }) => api.post("/reservations", data),

  getMyReservations: () => api.get("/reservations/my-reservations"),

  getByConfirmationCode: (code: string) =>
    api.get(`/reservations/confirm/${code}`),

  cancel: (id: string) => api.patch(`/reservations/${id}/cancel`),

  update: (id: string, data: Partial<{
    date: string;
    time: string;
    guests: number;
    specialRequests: string;
  }>) => api.put(`/reservations/${id}`, data),

  // Admin only
  getAll: (params?: { page?: number; status?: string; date?: string }) =>
    api.get("/reservations/admin", { params }),

  updateStatus: (id: string, status: string, reason?: string) =>
    api.patch(`/reservations/${id}/status`, { status, reason }),

  getAvailableSlots: (date: string, guests: number) =>
    api.get("/reservations/available-slots", { params: { date, guests } }),
};

/* ── Reviews ────────────────────────────────────────────────────────────────── */
export const reviewsApi = {
  getForItem: (menuItemId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/menu/${menuItemId}`, { params }),

  create: (data: {
    menuItem: string;
    order: string;
    rating: number;
    title?: string;
    body: string;
  }) => api.post("/reviews", data),

  update: (id: string, data: { rating?: number; title?: string; body?: string }) =>
    api.put(`/reviews/${id}`, data),

  delete: (id: string) => api.delete(`/reviews/${id}`),

  // Admin only
  getAll: (params?: { page?: number; isVerified?: boolean }) =>
    api.get("/reviews/admin", { params }),

  approve: (id: string) => api.patch(`/reviews/${id}/approve`),

  verify: (id: string) => api.patch(`/reviews/${id}/verify`),

  reply: (id: string, text: string) => api.post(`/reviews/${id}/reply`, { text }),
};

/* ── Blog ───────────────────────────────────────────────────────────────────── */
export const blogApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  }) => api.get("/blog", { params }),

  getBySlug: (slug: string) => api.get(`/blog/${slug}`),

  getFeatured: () => api.get("/blog/featured"),

  getCategories: () => api.get("/blog/categories"),

  // Admin only
  create: (data: FormData) =>
    api.post("/blog", data, { headers: { "Content-Type": "multipart/form-data" } }),

  update: (id: string, data: FormData) =>
    api.put(`/blog/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),

  delete: (id: string) => api.delete(`/blog/${id}`),

  publish: (id: string) => api.patch(`/blog/${id}/publish`),

  togglePublish: (id: string) => api.patch(`/blog/${id}/toggle-publish`),
};

/* ── Admin ──────────────────────────────────────────────────────────────────── */
export const adminApi = {
  getDashboardStats: () => api.get("/admin/dashboard"),

  getRevenueStats: (period?: string) =>
    api.get("/admin/revenue", { params: { period } }),

  getTopItems: (limit?: number) =>
    api.get("/admin/top-items", { params: { limit } }),

  getUsers: (params?: { page?: number; role?: string; search?: string }) =>
    api.get("/admin/users", { params }),

  updateUserRole: (userId: string, role: string) =>
    api.patch(`/admin/users/${userId}/role`, { role }),

  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  getActivityLog: (params?: { page?: number; limit?: number }) =>
    api.get("/admin/activity", { params }),
};

/* ── Coupons ────────────────────────────────────────────────────────────────── */
export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    api.post("/coupons/validate", { code, subtotal }),

  getAll: (params?: { page?: number; isActive?: boolean }) =>
    api.get("/coupons", { params }),

  create: (data: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderValue?: number;
    maxUsage?: number;
    expiresAt?: string;
  }) => api.post("/coupons", data),

  update: (id: string, data: Partial<{
    isActive: boolean;
    maxUsage: number;
    expiresAt: string;
  }>) => api.put(`/coupons/${id}`, data),

  delete: (id: string) => api.delete(`/coupons/${id}`),
};

/* ── Payments ───────────────────────────────────────────────────────────────── */
export const paymentsApi = {
  createPaymentIntent: (data: { orderId: string }) =>
    api.post("/payments/create-payment-intent", data),

  getPaymentHistory: (params?: { page?: number; limit?: number }) =>
    api.get("/payments/history", { params }),

  refund: (paymentId: string, amount?: number) =>
    api.post(`/payments/refund/${paymentId}`, { amount }),
};

/* ── Upload ─────────────────────────────────────────────────────────────────── */
export const uploadApi = {
  image: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("image", file);
    if (folder) formData.append("folder", folder);
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteImage: (publicId: string) =>
    api.delete("/upload/image", { data: { publicId } }),
};

/* ── User ───────────────────────────────────────────────────────────────────── */
export const userApi = {
  getProfile: () => api.get("/users/profile"),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    avatar?: File;
    preferences?: {
      isVeg?: boolean;
      allergies?: string[];
      newsletter?: boolean;
    };
  }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return api.put("/users/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post("/users/change-password", data),

  getAddresses: () => api.get("/users/addresses"),

  addAddress: (data: {
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  }) => api.post("/users/addresses", data),

  deleteAddress: (addressId: string) =>
    api.delete(`/users/addresses/${addressId}`),

  getLoyaltyPoints: () => api.get("/users/loyalty-points"),

  getWishlist: () => api.get("/users/wishlist"),

  addToWishlist: (menuItemId: string) =>
    api.post("/users/wishlist", { menuItemId }),

  removeFromWishlist: (menuItemId: string) =>
    api.delete(`/users/wishlist/${menuItemId}`),

  deleteAccount: () => api.delete("/users/account"),
};

// ─────────────────────────────────────────────────────────────────────────────
// Generic request helper with type safety
// ─────────────────────────────────────────────────────────────────────────────
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  const response = await api.request<T>(config);
  return response.data;
}

export default api;
