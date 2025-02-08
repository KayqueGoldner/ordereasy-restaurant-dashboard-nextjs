import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseCartDataState {
  items: CartItem[];
  discount: number;
  discountCode: string | null;
  tax: number;
  subTotal: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string, discountAmount: number) => void;
}

export const useCartData = create<UseCartDataState>()(
  persist(
    (set) => ({
      items: [],
      discount: 0,
      discountCode: null,
      subTotal: 0,
      tax: 0,
      total: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const updatedItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: item.quantity } : i,
              )
            : [...state.items, item];

          return calculateTotals(updatedItems, state.discount);
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return calculateTotals(updatedItems, state.discount);
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );
          return calculateTotals(updatedItems, state.discount);
        });
      },

      clearCart: () =>
        set({
          items: [],
          discount: 0,
          discountCode: null,
          subTotal: 0,
          tax: 0,
          total: 0,
        }),

      applyDiscountCode: (code, discountAmount) => {
        set((state) => calculateTotals(state.items, discountAmount, code));
      },
    }),
    {
      name: "ordereasy-cart-data",
    },
  ),
);

// Função auxiliar para recalcular subtotal, imposto e total
const calculateTotals = (
  items: CartItem[],
  discount: number,
  discountCode: string | null = null,
) => {
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subTotal * 0.15; // Taxa de 15%
  const total = subTotal - discount + tax;

  return {
    items,
    discount,
    discountCode,
    subTotal: parseFloat(subTotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};
