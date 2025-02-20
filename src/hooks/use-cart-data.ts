import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseCartDataState {
  items: CartItem[];
  discounts: { code: string; amount: number }[];
  totalDiscount: number;
  tax: number;
  subTotal: number;
  total: number;
  addItem: (item: CartItem) => void;
  addItems: (items: CartItem[]) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string, discountAmount: number) => void;
}

export const useCartData = create<UseCartDataState>()(
  persist(
    (set) => ({
      items: [],
      discounts: [],
      totalDiscount: 0,
      subTotal: 0,
      tax: 0,
      total: 0,

      // Adiciona um item ao carrinho
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const updatedItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: item.quantity + 1 } : i,
              )
            : [...state.items, item];

          return calculateTotals(updatedItems, state.discounts);
        });
      },

      // Adiciona vários itens ao carrinho
      addItems: (items) => {
        set((state) => {
          const updatedItems = [...state.items];
          items.forEach((item) => {
            const existingItem = updatedItems.find((i) => i.id === item.id);
            if (existingItem) {
              existingItem.quantity = item.quantity;
            } else {
              updatedItems.push(item);
            }
          });
          return calculateTotals(updatedItems, state.discounts);
        });
      },

      // Remove um item do carrinho
      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return calculateTotals(updatedItems, state.discounts);
        });
      },

      // Atualiza a quantidade de um item no carrinho
      updateQuantity: (id, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );
          return calculateTotals(updatedItems, state.discounts);
        });
      },

      // Limpa o carrinho
      clearCart: () =>
        set({
          items: [],
          subTotal: 0,
          tax: 0,
          total: 0,
        }),

      // Aplica um código de desconto, garantindo que ele não seja reutilizado
      applyDiscountCode: (code, discountAmount) => {
        set((state) => {
          if (state.discounts.some((d) => d.code === code)) {
            return state; // Código já utilizado, nenhuma alteração feita
          }
          const updatedDiscounts = [
            ...state.discounts,
            { code, amount: discountAmount },
          ];
          return calculateTotals(state.items, updatedDiscounts);
        });
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
  discounts: { code: string; amount: number }[],
) => {
  const subTotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const tax = subTotal * 0.15; // Taxa de 15%
  const totalDiscount = discounts.reduce(
    (sum, discount) => sum + discount.amount,
    0,
  );
  let total = subTotal - totalDiscount + tax;

  // Garantindo que o total não seja negativo
  total = Math.max(total, 0);

  return {
    items,
    discounts,
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    subTotal: parseFloat(subTotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};
