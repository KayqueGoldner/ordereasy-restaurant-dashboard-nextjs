import { create } from "zustand";

interface CartSidebarState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCartSidebar = create<CartSidebarState>((set) => ({
  isOpen: true,
  isClosed: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
}));
