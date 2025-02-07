import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface UseCartDataState {
  items: CartItem[];
  discount: number;
  discountCode: string | null;
  tax: number;
  subTotal: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string, discountAmount: number) => void;
}

export const useCartData = create<UseCartDataState>((set, get) => ({
  items: [],
  discount: 0,
  discountCode: null,
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      const updatedItems = existingItem
        ? state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          )
        : [...state.items, item];

      return { items: updatedItems };
    });
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    }));
  },
  clearCart: () => set({ items: [], discount: 0, discountCode: null }),

  applyDiscountCode: (code, discountAmount) => {
    set({ discount: discountAmount, discountCode: code });
  },

  get subTotal() {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  },
  get tax() {
    return get().subTotal * 0.08; // example: 8% of tax
  },
  get total() {
    return get().subTotal - get().discount + get().tax;
  },
}));
