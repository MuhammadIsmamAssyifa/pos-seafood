// src/app/kasir/_components/CartList.tsx
"use client";

import { useCart } from "@/hooks/use-cart";
import CartItem from "./CartItem";
import { ShoppingBag } from "lucide-react";

export default function CartList() {
  const { items } = useCart();

  // Hitung Total Belanja
  const subtotal = items.reduce((acc, item) => {
    const amount = item.unit === "KG" ? item.weight || 1 : item.quantity;
    return acc + item.priceAtTime * amount;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#c8c0b4]">
        <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">Keranjang masih kosong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-1">
        {items.map((item) => (
          <CartItem key={item.cartId} item={item} />
        ))}
      </div>

      {/* Ringkasan Harga di Bagian Bawah Keranjang */}
      <div className="mt-4 p-4 bg-[#faf8f5] rounded-2xl border border-[#f0ebe2] space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#a09888]">Subtotal</span>
          <span className="font-semibold">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-[#e2ddd6]">
          <span className="text-[#5a5040]">Total</span>
          <span className="text-orange-600">
            Rp {subtotal.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}
