import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartCustomization {
  group: string;
  option: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  customizations: CartCustomization[];
  totalPrice: number;
  isVeg: boolean;
  category: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  discount: number;
  isOpen: boolean;

  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, customizations?: CartCustomization[]) => void;
  updateQuantity: (id: string, quantity: number, customizations?: CartCustomization[]) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

const COUPONS: Record<string, number> = {
  LUMIERE10: 10,
  WELCOME20: 20,
  FEAST15: 15,
  FIRST50: 50,
};

function getItemKey(id: string, customizations: CartCustomization[]): string {
  const custKey = customizations
    .map((c) => `${c.group}:${c.option}`)
    .sort()
    .join('|');
  return `${id}__${custKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discount: 0,
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const key = getItemKey(item.id, item.customizations ?? []);
        const existingIndex = items.findIndex(
          (i) => getItemKey(i.id, i.customizations) === key
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          const qty = (item.quantity ?? 1);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
            totalPrice: updated[existingIndex].totalPrice + item.totalPrice * qty,
          };
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              { ...item, quantity: item.quantity ?? 1 },
            ],
          });
        }
      },

      removeItem: (id, customizations = []) => {
        const { items } = get();
        const key = getItemKey(id, customizations);
        set({ items: items.filter((i) => getItemKey(i.id, i.customizations) !== key) });
      },

      updateQuantity: (id, quantity, customizations = []) => {
        if (quantity <= 0) {
          get().removeItem(id, customizations);
          return;
        }
        const { items } = get();
        const key = getItemKey(id, customizations);
        set({
          items: items.map((item) => {
            if (getItemKey(item.id, item.customizations) === key) {
              const unitPrice = item.basePrice + item.customizations.reduce((s, c) => s + c.price, 0);
              return { ...item, quantity, totalPrice: unitPrice * quantity };
            }
            return item;
          }),
        });
      },

      clearCart: () => set({ items: [], couponCode: '', discount: 0 }),

      applyCoupon: (code) => {
        const upper = code.trim().toUpperCase();
        if (COUPONS[upper]) {
          set({ couponCode: upper, discount: COUPONS[upper] });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: '', discount: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 500 ? 0 : 50;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Math.round(subtotal * 0.05);
      },

      getTotal: () => {
        const { discount } = get();
        const subtotal = get().getSubtotal();
        const discountAmount = Math.round(subtotal * (discount / 100));
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        return subtotal - discountAmount + deliveryFee + tax;
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'lumiere-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
