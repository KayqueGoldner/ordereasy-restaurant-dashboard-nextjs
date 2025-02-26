import { create } from "zustand";

import { Product } from "@/db/schema/products";

interface ProductItem {
  product: Product;
  categoryName: string;
}

interface ProductCardModalState {
  product: ProductItem | null;
  openModal: (id: ProductItem | null) => void;
  closeModal: () => void;
}

export const useProductCardModal = create<ProductCardModalState>((set) => ({
  product: null,
  openModal: (product) => set({ product }),
  closeModal: () => set({ product: null }),
}));
