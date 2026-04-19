"use client";

import { useState } from "react";
import { processPayment } from "@/app/actions/order";
import { Check, CreditCard, Banknote, QrCode, Loader2 } from "lucide-react";

export default function PaymentModal({ order, total, onClose }: any) {
  const [method, setMethod] = useState<"CASH" | "QRIS" | "DEBIT">("CASH");
  const [cashReceived, setCashReceived] = useState<number>(total);
  const [loading, setLoading] = useState(false);

  const change = cashReceived - total;

  const handlePayment = async () => {
    if (method === "CASH" && cashReceived < total) {
      alert("Uang tunai kurang!");
      return;
    }

    setLoading(true);
    const res = await processPayment(order.id, method, total);

    // Gunakan pengecekan success yang pasti untuk TypeScript
    if (res.success) {
      alert(
        `Pembayaran Berhasil!${method === "CASH" ? ` Kembalian: Rp ${change.toLocaleString()}` : ""}`,
      );
      onClose();
    } else {
      alert("Gagal: " + (res as any).error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-3xl shadow-xl border max-w-md w-full font-['Sora',sans-serif]">
      <h2 className="text-xl font-black mb-1">PEMBAYARAN</h2>
      <p className="text-sm text-gray-500 mb-6 font-medium">
        Meja #{order.tableNumber} - {order.customerName}
      </p>

      {/* Ringkasan Total */}
      <div className="bg-[#faf8f5] p-5 rounded-2xl mb-6 border border-dashed border-[#e8e2d8]">
        <div className="flex justify-between items-center text-gray-600 mb-2 text-sm font-bold">
          <span>Total Tagihan</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between items-center text-2xl font-black text-[#c45c1a]">
          <span>TOTAL</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {/* Input Tunai (Hanya muncul jika CASH) */}
      {method === "CASH" && (
        <div className="mb-6 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Uang Diterima
            </label>
            <input
              type="number"
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-[#c45c1a] outline-none font-bold text-lg mt-1"
            //   value={cashReceived}
              onChange={(e) => setCashReceived(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
            <span className="text-xs font-bold text-green-700">KEMBALIAN</span>
            <span className="font-black text-green-700">
              Rp {Math.max(0, change).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}

      {/* Pilih Metode */}
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
        Metode Bayar
      </p>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { id: "CASH", label: "Tunai", icon: Banknote },
          { id: "QRIS", label: "QRIS", icon: QrCode },
          { id: "DEBIT", label: "Debit", icon: CreditCard },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMethod(m.id as any);
              if (m.id !== "CASH") setCashReceived(total);
            }}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
              method === m.id
                ? "border-[#c45c1a] bg-[#fff8f5] text-[#c45c1a]"
                : "border-gray-100 text-gray-400 hover:border-gray-200"
            }`}
          >
            <m.icon className="w-5 h-5 mb-2" />
            <span className="text-[10px] font-bold uppercase">{m.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || (method === "CASH" && change < 0)}
        className="w-full h-14 bg-[#2d7a3a] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-[#246030] transition-all active:scale-[0.97] disabled:bg-gray-200 disabled:shadow-none"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Check className="w-6 h-6" /> SELESAIKAN PEMBAYARAN
          </>
        )}
      </button>
    </div>
  );
}
