// app/kasir/_components/MobileCartTrigger.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";

export default function MobileCartTrigger() {
  const cart = useCartStore((state) => state.cart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 rounded-xl bg-[#fff8f2] border border-[#f0d4c0] text-[#c45c1a] lg:hidden"
    >
      <ShoppingCart className="w-6 h-6" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
          {cart.length}
        </span>
      )}
    </button>
  );
}
