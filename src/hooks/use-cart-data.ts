import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseCartDataState {
  items: Product[];
  discounts: Discounts[];
  totalDiscount: string;
  tax: string;
  subTotal: string;
  total: string;
  addItem: (item: Product) => void;
  addItems: (items: Product[]) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  updateDiscounts: (discounts: Discounts[]) => void;
  applyDiscountCode: (code: string, discountAmount: number) => void;
}

export const useCartData = create<UseCartDataState>()(
  persist(
    (set) => ({
      items: [],
      discounts: [],
      totalDiscount: "0",
      subTotal: "0",
      tax: "0",
      total: "0",

      // Adiciona um item ao carrinho
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const updatedItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: item.quantity } : i,
              )
            : [...state.items, item];

          return calculateCartInfo(updatedItems, state.discounts);
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
          return calculateCartInfo(updatedItems, state.discounts);
        });
      },

      // Remove um item do carrinho
      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return calculateCartInfo(updatedItems, state.discounts);
        });
      },

      // Atualiza a quantidade de um item no carrinho
      updateQuantity: (id, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );
          return calculateCartInfo(updatedItems, state.discounts);
        });
      },

      // Limpa o carrinho
      clearCart: () =>
        set({
          items: [],
          subTotal: "0",
          tax: "0",
          total: "0",
        }),

      updateDiscounts: (newDiscounts: Discounts[]) => {
        set((state) => calculateCartInfo(state.items, newDiscounts));
      },

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
          return calculateCartInfo(state.items, updatedDiscounts);
        });
      },
    }),
    {
      name: "ordereasy-cart-data",
    },
  ),
);

// Função auxiliar para recalcular subtotal, imposto e total
export const calculateCartInfo = (
  items: Product[],
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
    totalDiscount: totalDiscount.toFixed(2).toString(),
    subTotal: subTotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
};
