import { create } from "zustand";

interface ProductCardModalState {
  product: Product | null;
  openModal: (product: Product | null) => void;
  closeModal: () => void;
}

export const useProductCardModal = create<ProductCardModalState>((set) => ({
  product: null,
  openModal: (product) => set({ product }),
  closeModal: () => set({ product: null }),
}));
