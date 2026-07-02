'use client';
// Cart store — ported from the original localStorage-backed cart.
// One line per product (keyed by beatId); re-adding a beat replaces its tier.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/checkout';
import { buildCheckoutUrl } from '@/lib/checkout';
import type { Beat, Kit, License, LicenseTier } from '@/lib/products';
import { track, trackEcommerce } from '@/lib/analytics';

const CART_KEY = 'prodessential_cart_v1';

export function beatCartItem(beat: Beat, tierKey: LicenseTier, lic: License): CartItem {
  return {
    beatId: beat.id, beatTitle: beat.title,
    tierKey, tierLabel: lic.label,
    payhipKey: lic._payhipKey ?? null, variantId: lic._variantId ?? null,
    price: lic.price, type: 'beat',
    imgFile: beat.imgFile, imgGradient: beat.imgGradient,
  };
}

export function kitCartItem(kit: Kit): CartItem {
  return {
    beatId: kit.id, beatTitle: kit.title,
    tierKey: 'kit', tierLabel: kit.type || 'Kit',
    payhipKey: kit._payhipKey ?? null, variantId: kit._variantId ?? null,
    price: kit.price, type: 'kit',
    imgFile: kit.imgFile, imgGradient: kit.imgGradient,
  };
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => 'added' | 'updated';
  remove: (beatId: string) => void;
  clear: () => void;
  setTier: (item: CartItem) => void;
  checkout: () => void;
  buyNow: (item: CartItem) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((it) => it.beatId === item.beatId);
        let result: 'added' | 'updated' = 'added';
        if (idx !== -1) {
          result = items[idx].tierKey !== item.tierKey ? 'updated' : 'added';
          items.splice(idx, 1);
        }
        items.push(item);
        trackEcommerce('add_to_cart', [{ item_id: item.beatId, item_name: item.beatTitle, price: item.price, item_variant: item.tierLabel }]);
        set({ items });
        return result;
      },

      remove: (beatId) => {
        const removed = get().items.find((it) => String(it.beatId) === String(beatId));
        set({ items: get().items.filter((it) => String(it.beatId) !== String(beatId)) });
        if (removed) {
          track('remove_from_cart', { items: [{ item_id: removed.beatId, item_name: removed.beatTitle }] });
        }
      },

      clear: () => set({ items: [] }),

      setTier: (item) => {
        const items = [...get().items];
        const idx = items.findIndex((it) => String(it.beatId) === String(item.beatId));
        if (idx === -1) return;
        items[idx] = item;
        set({ items });
      },

      checkout: () => {
        const items = get().items.filter((it) => it.payhipKey);
        if (items.length === 0) return;
        trackEcommerce('begin_checkout', items.map((i) => ({ item_id: i.beatId, item_name: i.beatTitle, price: i.price, item_variant: i.tierLabel })));
        window.location.href = buildCheckoutUrl(items);
      },

      buyNow: (item) => {
        if (!item || !item.payhipKey) return;
        trackEcommerce('begin_checkout', [{ item_id: item.beatId, item_name: item.beatTitle, price: item.price, item_variant: item.tierLabel }]);
        window.location.href = buildCheckoutUrl([item]);
      },
    }),
    { name: CART_KEY, partialize: (s) => ({ items: s.items }) },
  ),
);
