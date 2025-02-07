import { create } from "zustand";

interface ProductCardModalState {
  productId: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useProductCardModal = create<ProductCardModalState>((set) => ({
  productId: null,
  openModal: (id) => set({ productId: id }),
  closeModal: () => set({ productId: null }),
}));
