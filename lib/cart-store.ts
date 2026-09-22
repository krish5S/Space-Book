"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// A "booking cart": lets a student stage several slot requests
// (possibly across different resources) before submitting them all.
// Persisted to localStorage so the cart survives refresh/navigation —
// this is the CO1/CO2 "persistent client state" requirement.
export type CartSlot = {
  id: string; // client-generated, not a DB id yet
  resourceId: string;
  resourceName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
};

type CartState = {
  slots: CartSlot[];
  addSlot: (slot: CartSlot) => void;
  removeSlot: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      slots: [],
      addSlot: (slot) => set((s) => ({ slots: [...s.slots, slot] })),
      removeSlot: (id) => set((s) => ({ slots: s.slots.filter((x) => x.id !== id) })),
      clearCart: () => set({ slots: [] }),
    }),
    { name: "spacebook-cart" }
  )
);
