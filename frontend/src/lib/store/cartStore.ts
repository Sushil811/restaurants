import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface CartCustomization {
  [key: string]: string; // e.g. { spiceLevel: "Medium", extras: "No onion" }
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
  /** Unique key combining menuItemId + serialised customizations */
  cartKey: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

export interface CartState {
  // Data
  items: CartItem[];
  isOpen: boolean;
  coupon: AppliedCoupon | null;

  // Cart CRUD
  addItem: (item: Omit<CartItem, "cartKey" | "quantity"> & { quantity?: number }) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;

  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Coupon
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;

  // Computed (as actions returning values, compatible with Zustand)
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: (subtotal?: number) => number;
  getTax: (subtotal?: number) => number;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (menuItemId: string, customizations?: CartCustomization) => boolean;
  getItemQuantity: (cartKey: string) => number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function buildCartKey(menuItemId: string, customizations: CartCustomization): string {
  const serialised =
    Object.keys(customizations).length > 0
      ? "_" + JSON.stringify(customizations, Object.keys(customizations).sort())
      : "";
  return `${menuItemId}${serialised}`;
}

const DELIVERY_THRESHOLD = 499; // free delivery above ₹499
const DELIVERY_FEE = 49;
const TAX_RATE = 0.05; // 5% GST

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      items: [],
      isOpen: false,
      coupon: null,

      // ── addItem ────────────────────────────────────────────────────────────
      addItem: (item) => {
        const customizations = item.customizations ?? {};
        const cartKey = buildCartKey(item.menuItemId, customizations);

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.cartKey === cartKey);

          if (existingIndex >= 0) {
            // Increment quantity
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + (item.quantity ?? 1),
            };
            return { items: updatedItems };
          }

          // Add new item
          const newItem: CartItem = {
            ...item,
            quantity: item.quantity ?? 1,
            customizations,
            cartKey,
          };
          return { items: [...state.items, newItem] };
        });
      },

      // ── removeItem ─────────────────────────────────────────────────────────
      removeItem: (cartKey) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartKey !== cartKey),
        }));
      },

      // ── updateQuantity ─────────────────────────────────────────────────────
      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, quantity: Math.min(quantity, 20) } : i
          ),
        }));
      },

      // ── clearCart ──────────────────────────────────────────────────────────
      clearCart: () => set({ items: [], coupon: null }),

      // ── Drawer ─────────────────────────────────────────────────────────────
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // ── Coupon ─────────────────────────────────────────────────────────────
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      // ── Computed Values ────────────────────────────────────────────────────
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const { coupon } = get();
        if (!coupon) return 0;
        return coupon.discountAmount;
      },

      getDeliveryFee: (subtotal?: number) => {
        const sub = subtotal ?? get().getSubtotal();
        return sub >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
      },

      getTax: (subtotal?: number) => {
        const sub = subtotal ?? get().getSubtotal();
        const discount = get().getDiscount();
        return Math.round((sub - discount) * TAX_RATE);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const delivery = get().getDeliveryFee(subtotal);
        const tax = get().getTax(subtotal);
        return Math.max(0, subtotal - discount + delivery + tax);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isInCart: (menuItemId, customizations = {}) => {
        const key = buildCartKey(menuItemId, customizations);
        return get().items.some((i) => i.cartKey === key);
      },

      getItemQuantity: (cartKey) => {
        const item = get().items.find((i) => i.cartKey === cartKey);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "lumiere_cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as never)
      ),
      // Only persist items and coupon — do NOT persist isOpen
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// Selector hooks (memoised slices to prevent unnecessary re-renders)
// ─────────────────────────────────────────────────────────────────────────────
export const useCartItems = () => useCartStore((s) => s.items);
export const useCartIsOpen = () => useCartStore((s) => s.isOpen);
export const useCartCoupon = () => useCartStore((s) => s.coupon);
export const useCartItemCount = () => useCartStore((s) => s.getItemCount());
export const useCartSubtotal = () => useCartStore((s) => s.getSubtotal());
export const useCartTotal = () => useCartStore((s) => s.getTotal());
export const useCartDiscount = () => useCartStore((s) => s.getDiscount());
export const useCartDeliveryFee = () => useCartStore((s) => s.getDeliveryFee());
export const useCartTax = () => useCartStore((s) => s.getTax());
