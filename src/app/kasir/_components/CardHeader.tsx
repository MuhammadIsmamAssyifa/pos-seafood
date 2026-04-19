// src/app/kasir/_components/CartHeader.tsx
"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CartList from "./CartList";

export default function CartHeader() {
  const items = useCart((state) => state.items);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white p-4 flex justify-between items-center md:hidden">
      <h1 className="font-bold text-lg">Kasir Seafood</h1>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Keranjang Belanja</SheetTitle>
          </SheetHeader>
          {/* Komponen daftar belanjaan di dalam drawer */}
          <div className="flex-1 overflow-y-auto mt-4">
            <CartList />
          </div>
          <div className="pt-4 border-t">
            <Button className="w-full bg-orange-600 h-12 font-bold">
              Checkout Pesanan
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
