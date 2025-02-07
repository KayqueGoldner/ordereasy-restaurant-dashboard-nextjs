import { create } from "zustand";

interface ProductCardModalState {
  productId: string | number | null;
  openModal: (id: string | number) => void;
  closeModal: () => void;
}

export const useProductCardModal = create<ProductCardModalState>((set) => ({
  productId: null,
  openModal: (id) => set({ productId: id }),
  closeModal: () => set({ productId: null }),
}));
