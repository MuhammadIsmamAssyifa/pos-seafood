"use client";

import { Button } from "@/components/ui/button";
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
    <Button
      onClick={handleComplete}
      disabled={isPending}
      className={`w-full mt-4 transition-all gap-2 py-6 ${
        isPending
          ? "bg-zinc-700"
          : "bg-zinc-800 hover:bg-green-700 text-zinc-300 hover:text-white"
      }`}
    >
      <CheckCircle2 className="w-5 h-5" />
      {isPending ? "Memproses..." : "SELESAI MASAK"}
    </Button>
  );
}
