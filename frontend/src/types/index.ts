// =============================================================================
// Lumiere Restaurant — Comprehensive TypeScript Type Definitions
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Utility / Generic
// ─────────────────────────────────────────────────────────────────────────────

/** Standard API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

/** Paginated API response */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Sort direction */
export type SortDirection = "asc" | "desc";

/** Select option (for dropdowns) */
export interface SelectOption {
  label: string;
  value: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// User
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin" | "staff";

export interface UserPreferences {
  isVeg: boolean;
  allergies: string[];
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
}

export interface DeliveryAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  preferences?: UserPreferences;
  addresses?: DeliveryAddress[];
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu & Categories
// ─────────────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  icon?: string;
  itemCount?: number;
  sortOrder: number;
  isActive: boolean;
}

export type SpiceLevel = "mild" | "medium" | "hot" | "extra-hot";
export type CourseType = "appetizer" | "main" | "dessert" | "beverage" | "side";

export interface MenuCustomizationOption {
  label: string;
  value: string;
  priceAdjustment: number; // positive = extra charge, 0 = no change
}

export interface MenuCustomizationGroup {
  id: string;
  name: string; // e.g. "Spice Level", "Add-ons", "Size"
  type: "single" | "multiple"; // single = radio, multiple = checkbox
  required: boolean;
  options: MenuCustomizationOption[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: Category | string; // populated or ObjectId
  price: number;
  discountPrice?: number;
  images: string[];
  thumbnail?: string;
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  spiceLevel?: SpiceLevel;
  courseType: CourseType;
  tags: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  preparationTime: number; // minutes
  customizations: MenuCustomizationGroup[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isChefSpecial: boolean;
  isAvailable: boolean;
  isNew: boolean;
  servingSize?: string; // e.g. "Serves 2"
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────────────────────────────────────

export interface CartCustomization {
  [key: string]: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  isVeg: boolean;
  customizations: CartCustomization;
  cartKey: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentMethod = "online" | "cod" | "wallet";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type OrderType = "delivery" | "pickup" | "dine_in";

export interface OrderItem {
  menuItem: MenuItem | string;
  name: string; // snapshot at time of order
  price: number; // snapshot
  quantity: number;
  customizations: CartCustomization;
  subtotal: number;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  refundId?: string;
  refundedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  orderType: OrderType;
  deliveryAddress?: DeliveryAddress;
  tableNumber?: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  payment: PaymentDetails;
  orderStatus: OrderStatus;
  estimatedDeliveryTime?: string;
  specialInstructions?: string;
  statusHistory: Array<{
    status: OrderStatus;
    note?: string;
    updatedAt: string;
  }>;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reservations
// ─────────────────────────────────────────────────────────────────────────────

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no_show";

export type Occasion =
  | "birthday"
  | "anniversary"
  | "business"
  | "date"
  | "family"
  | "other";

export interface Reservation {
  id: string;
  confirmationCode: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: Occasion;
  specialRequests?: string;
  tableNumber?: number;
  status: ReservationStatus;
  cancellationReason?: string;
  cancelledAt?: string;
  user?: User | string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  user: User | string;
  menuItem: MenuItem | string;
  order: Order | string;
  rating: number; // 1-5
  title?: string;
  body: string;
  images?: string[];
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  isVerified: boolean; // admin verified
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Blog
// ─────────────────────────────────────────────────────────────────────────────

export type BlogCategory =
  | "recipes"
  | "culture"
  | "chef-notes"
  | "events"
  | "wine"
  | "ingredients"
  | "news";

export interface BlogAuthor {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich text / Markdown
  coverImage: string;
  author: BlogAuthor;
  category: BlogCategory;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  readTime: string; // e.g. "5 min read"
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Coupons
// ─────────────────────────────────────────────────────────────────────────────

export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number; // cap for percentage discounts
  minOrderValue: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicableCategories?: string[];
  applicableItems?: string[];
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Payments
// ─────────────────────────────────────────────────────────────────────────────

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery
// ─────────────────────────────────────────────────────────────────────────────

export type GalleryCategory =
  | "food"
  | "ambiance"
  | "events"
  | "team"
  | "desserts"
  | "cocktails";

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
  category: GalleryCategory;
  width: number;
  height: number;
  sortOrder: number;
  isFeatured: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin / Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalReservations: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{
    menuItem: MenuItem;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavLink[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Types
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: Occasion | "";
  specialRequests?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ReviewForm {
  rating: number;
  title?: string;
  body: string;
}

export interface NewsletterForm {
  email: string;
  name?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI Component Props
// ─────────────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export type ToastType = "success" | "error" | "warning" | "info";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filters & Search
// ─────────────────────────────────────────────────────────────────────────────

export interface MenuFilters {
  category?: string;
  search?: string;
  isVeg?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  maxPrice?: number;
  minRating?: number;
  courseType?: CourseType;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
}

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Business / Restaurant Info
// ─────────────────────────────────────────────────────────────────────────────

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    googleMapsUrl?: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    tripadvisor?: string;
  };
  businessHours: BusinessHours[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Helpers (Type Utilities)
// ─────────────────────────────────────────────────────────────────────────────

/** Make certain keys required */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make certain keys optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Extract array element type */
export type ArrayElement<A> = A extends ReadonlyArray<infer T> ? T : never;

/** Nullable wrapper */
export type Nullable<T> = T | null;

/** ID types */
export type ID = string;
