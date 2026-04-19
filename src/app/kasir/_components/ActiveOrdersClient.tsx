"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PaymentModal from "@/components/PaymentModal";
import { Wallet, Users, Utensils } from "lucide-react";

export default function ActiveOrdersClient({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialOrders.map((order) => {
          // Hitung total belanja meja ini
          const totalAmount = order.items.reduce(
            (sum: number, item: any) => sum + Number(item.subtotal),
            0,
          );

          // Cek apakah semua masakan sudah disajikan (status SERVED)
          const isAllServed = order.items.every(
            (i: any) => i.status === "SERVED",
          );

          return (
            <div
              key={order.id}
              className="bg-white border-2 border-[#e8e2d8] rounded-3xl p-5 hover:border-[#c45c1a] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#1c1c18] text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl">
                  {order.tableNumber}
                </div>
                {isAllServed && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full animate-pulse">
                    SIAP BAYAR
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg text-[#1c1c18] truncate">
                {order.customerName}
              </h3>

              <div className="flex gap-4 mt-2 mb-6">
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <Users className="w-3 h-3" /> {order.customerCount} Orang
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <Utensils className="w-3 h-3" /> {order.items.length} Menu
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Total Tagihan
                  </p>
                  <p className="font-black text-[#c45c1a]">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder({ ...order, totalAmount })}
                  className="bg-[#2d7a3a] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#246030]"
                >
                  <Wallet className="w-4 h-4" /> Bayar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL PEMBAYARAN */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="p-0 border-none bg-transparent max-w-md shadow-none">
          {selectedOrder && (
            <PaymentModal
              order={selectedOrder}
              total={selectedOrder.totalAmount}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
