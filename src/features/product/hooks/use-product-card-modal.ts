import { create } from "zustand";

import { Product } from "@/db/schema/product";

interface ProductCardModalState {
  product: Product | null;
  openModal: (id: Product | null | null) => void;
  closeModal: () => void;
}

export const useProductCardModal = create<ProductCardModalState>((set) => ({
  product: null,
  openModal: (product) => set({ product }),
  closeModal: () => set({ product: null }),
}));
