"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";

export default function OrderSidebar() {
  const [items, setItems] = useState<any[]>([]);

  return (
    <div className="w-96 bg-white border-l shadow-xl p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Pesanan Baru</h2>

      <div className="space-y-4 mb-4">
        <input
          className="w-full p-2 border rounded"
          placeholder="Nama Pelanggan (Contoh: Pak Budi)"
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Jumlah Orang"
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Nomor Papan Meja"
        />
      </div>

      <div className="flex-1 overflow-y-auto border-t pt-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            Keranjang Kosong
          </p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-4">
              {/* Nanti detail item di sini */}
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-6 border-t">
        <div className="flex justify-between mb-4 text-lg font-bold">
          <span>Total</span>
          <span>Rp 0</span>
        </div>
        <Button className="w-full py-6 text-lg" disabled={items.length === 0}>
          Simpan & Cetak Papan
        </Button>
      </div>
    </div>
  );
}
