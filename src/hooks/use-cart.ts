// src/hooks/use-cart.ts
import { create } from 'zustand';

interface CartItem {
    cartId: string;
    productId: string;
    productName: string;
    sauceId?: number | null;
    sauceName?: string | null;
    basePrice: number;
    extraPrice: number;
    priceAtTime: number;
    quantity: number;
    weight?: number | null;
    unit: "KG" | "PCS";
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, qty: number) => void;
    clearCart: () => void;
    totalItems: number;
}

export const useCart = create<CartStore>((set) => ({
    items: [],
    addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.cartId === newItem.cartId);
        if (existing) {
            return {
                items: state.items.map(i =>
                    i.cartId === newItem.cartId ? { ...i, quantity: i.quantity + 1 } : i
                )
            };
        }
        return { items: [...state.items, newItem] };
    }),
    removeItem: (cartId) => set((state) => ({
        items: state.items.filter(i => i.cartId !== cartId)
    })),
    updateQuantity: (cartId, qty) => set((state) => ({
        items: state.items.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i)
    })),
    clearCart: () => set({ items: [] }),
    get totalItems() { return 0 } // Kita akan hitung di komponen saja
}));