import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UseCartDataState {
  items: Product[];
  totalDiscount: string;
  tax: string;
  subTotal: string;
  total: string;
  addItem: (item: Product) => void;
  addItems: (items: Product[]) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  updateTotalDiscount: (discounts: string[]) => void;
}

export const useCartData = create<UseCartDataState>()(
  persist(
    (set) => ({
      items: [],
      totalDiscount: "0",
      subTotal: "0",
      tax: "0",
      total: "0",

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          const updatedItems = existingItem
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: item.quantity } : i,
              )
            : [...state.items, item];

          return calculateCartInfo(updatedItems, state.totalDiscount);
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
          return calculateCartInfo(updatedItems, state.totalDiscount);
        });
      },

      // Remove um item do carrinho
      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return calculateCartInfo(updatedItems, state.totalDiscount);
        });
      },

      // Atualiza a quantidade de um item no carrinho
      updateQuantity: (id, quantity) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );
          return calculateCartInfo(updatedItems, state.totalDiscount);
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

      updateTotalDiscount: (discounts: string[]) => {
        const totalDiscount = discounts.reduce((acc, discount) => {
          const discountValue = parseFloat(discount) || 0;
          return acc + discountValue;
        }, 0);

        set((state) =>
          calculateCartInfo(state.items, totalDiscount.toString()),
        );
      },
    }),
    {
      name: "ordereasy-cart-data",
    },
  ),
);

export const calculateCartInfo = (items: Product[], totalDiscount: string) => {
  const subTotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  const discount = Number(totalDiscount);
  const subTotalAfterDiscount = subTotal - discount;

  const tax = subTotalAfterDiscount * 0.15; // 15% Tax
  let total = subTotalAfterDiscount + tax;

  total = Math.max(total, 0);

  return {
    items,
    totalDiscount: discount.toFixed(2).toString(),
    subTotal: subTotal.toFixed(2),
    subTotalAfterDiscount: subTotalAfterDiscount.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
};
