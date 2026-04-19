// src/hooks/use-cart-store.ts
import { create } from 'zustand';

interface CartStore {
    cart: any[];
    setCart: (cart: any[]) => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>((set) => ({
    cart: [],
    setCart: (cart) => set({ cart }),
    isCartOpen: false,
    setIsCartOpen: (open) => set({ isCartOpen: open }),
}));