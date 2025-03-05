import { create } from "zustand";

interface SignInFormModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSignInFormModal = create<SignInFormModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
