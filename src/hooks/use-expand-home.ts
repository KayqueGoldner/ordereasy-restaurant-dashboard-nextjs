import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExpandedHomeState {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useExpandHome = create<ExpandedHomeState>()(
  persist(
    (set) => ({
      isExpanded: false,
      onExpand: () => set(() => ({ isExpanded: true })),
      onCollapse: () => set(() => ({ isExpanded: false })),
    }),
    {
      name: "expanded-home-list",
    },
  ),
);
