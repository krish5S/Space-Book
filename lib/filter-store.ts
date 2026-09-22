"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Persistent filter panel state — kept as its own slice so that
// toggling a filter never re-renders anything outside the resource
// grid (no accidental re-renders across the server-rendered layout).
type FilterState = {
  building: string | "all";
  type: string | "all";
  setBuilding: (b: string) => void;
  setType: (t: string) => void;
  reset: () => void;
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      building: "all",
      type: "all",
      setBuilding: (b) => set({ building: b }),
      setType: (t) => set({ type: t }),
      reset: () => set({ building: "all", type: "all" }),
    }),
    { name: "spacebook-filters" }
  )
);
