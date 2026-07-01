'use client';
// UI store — which modal/drawer is open and the active beat/kit id.
import { create } from 'zustand';

interface UIState {
  cartOpen: boolean;
  activeBeatId: string | null;
  activeKitId: string | null;
  licenseModalTier: string | null;
  newsletterCollapsed: boolean;

  openCart: () => void;
  closeCart: () => void;
  openBeat: (id: string) => void;
  closeBeat: () => void;
  openKit: (id: string) => void;
  closeKit: () => void;
  openLicense: (tier: string) => void;
  closeLicense: () => void;
  toggleNewsletter: () => void;
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  activeBeatId: null,
  activeKitId: null,
  licenseModalTier: null,
  newsletterCollapsed: false,

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openBeat: (id) => set({ activeBeatId: id }),
  closeBeat: () => set({ activeBeatId: null }),
  openKit: (id) => set({ activeKitId: id }),
  closeKit: () => set({ activeKitId: null }),
  openLicense: (tier) => set({ licenseModalTier: tier }),
  closeLicense: () => set({ licenseModalTier: null }),
  toggleNewsletter: () => set((s) => ({ newsletterCollapsed: !s.newsletterCollapsed })),
}));
