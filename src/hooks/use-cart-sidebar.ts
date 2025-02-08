import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartSidebarState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCartSidebar = create<CartSidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      onOpen: () => set(() => ({ isOpen: true })),
      onClose: () => set(() => ({ isOpen: false })),
    }),
    {
      name: "cart-sidebar-state",
    },
  ),
);
