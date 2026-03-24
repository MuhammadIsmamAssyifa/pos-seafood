// components/KitchenCard.tsx
"use client";

import { CheckCircle2 } from "lucide-react";
import { completeCooking } from "@/app/actions/order";
import { useState } from "react";

export default function KitchenCardButton({ orderId }: { orderId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleComplete = async () => {
    if (!confirm("Yakin pesanan ini sudah selesai dimasak?")) return;
    setIsPending(true);
    const result = await completeCooking(orderId);
    if (!result.success) {
      alert(result.error);
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleComplete}
      disabled={isPending}
      className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold transition-all border-[1.5px] font-['Sora',sans-serif] ${
        isPending
          ? "bg-[#f5f2ed] border-[#e2ddd6] text-[#a09888] cursor-not-allowed"
          : "bg-[#eaf3de] border-[#c0dd97] text-[#27500a] hover:bg-[#2d7a3a] hover:text-white hover:border-[#2d7a3a]"
      }`}
    >
      <CheckCircle2 className="w-4 h-4" />
      {isPending ? "Memproses..." : "Selesai Masak"}
    </button>
  );
}
