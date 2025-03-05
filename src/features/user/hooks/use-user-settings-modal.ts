import { create } from "zustand";

type targetModal = "name" | "address" | null;

interface UserSettingsModalState {
  isOpen: boolean;
  target: targetModal;
  openModal: (target?: targetModal) => void;
  closeModal: () => void;
}

export const useUserSettingsModal = create<UserSettingsModalState>((set) => ({
  isOpen: false,
  target: null,
  openModal: (target?: targetModal) => set({ isOpen: true, target }),
  closeModal: () => set({ isOpen: false, target: null }),
}));
