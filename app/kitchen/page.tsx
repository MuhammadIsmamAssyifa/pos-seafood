// app/kitchen/page.tsx
import { prisma } from "@/lib/prisma";
import { UtensilsCrossed, Clock, Users } from "lucide-react";
import KitchenCardButton from "@/components/KitchenCard";

export const revalidate = 10;

function minutesAgo(date: Date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

export default async function KitchenPage() {
  const activeOrders = await prisma.order.findMany({
    where: { status: "OPEN" },
    include: { items: { include: { product: true, sauce: true } } },
    orderBy: { createdAt: "asc" }, // oldest first — most urgent at top
  });

  return (
    <div className="min-h-screen bg-white font-['Sora',sans-serif]">
      <div className="p-5 md:p-7">

        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-5 mb-6 border-b-2 border-[#e8e2d8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fff3eb] border border-[#f0d4c0] rounded-xl flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-[#c45c1a]" />
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold text-[#1c1c18] tracking-tight">
                Monitor Dapur
              </h1>
              <p className="text-[11px] text-[#a09888] mt-0.5">
                Pesanan masuk otomatis diperbarui
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-[#e2ddd6] rounded-lg px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2d7a3a]" />
              <span className="text-[11.5px] font-semibold text-[#5a5040]">
                Live · tiap 10 detik
              </span>
            </div>
            {activeOrders.length > 0 && (
              <div className="bg-[#fff3eb] border border-[#f0d4c0] rounded-lg px-3 py-1.5">
                <span className="text-[11.5px] font-bold text-[#993c1d]">
                  {activeOrders.length} pesanan aktif
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Empty state */}
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[360px] gap-3">
            <div className="w-16 h-16 bg-[#f5f2ed] border border-[#e8e2d8] rounded-2xl flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-[#c8c0b4]" />
            </div>
            <p className="text-[15px] font-semibold text-[#a09888]">Dapur Tenang</p>
            <p className="text-[12px] text-[#c8c0b4]">Belum ada pesanan masuk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeOrders.map((order) => {
              const age = minutesAgo(order.createdAt);
              const isUrgent = age >= 15;
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border flex flex-col overflow-hidden transition-shadow ${
                    isUrgent
                      ? "border-[#f0d4c0] shadow-[0_0_0_2px_#f0d4c020]"
                      : "border-[#e8e2d8]"
                  }`}
                >
                  {/* Ticket header */}
                  <div className="relative px-4 pt-4 pb-3 border-b border-[#f0ebe2]">
                    {/* Table number badge */}
                    <div className="absolute top-0 right-0 bg-[#c45c1a] text-white text-[17px] font-extrabold px-4 py-1.5 rounded-bl-2xl leading-none">
                      #{order.tableNumber}
                    </div>

                    <p className="text-[14px] font-bold text-[#1c1c18] uppercase tracking-wide pr-14 leading-snug">
                      {order.customerName}
                    </p>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-[#a09888] font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#a09888] font-medium">
                        <Users className="w-3 h-3" />
                        {order.customerCount} orang
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isUrgent
                            ? "bg-[#fff3eb] text-[#993c1d]"
                            : "bg-[#eaf3de] text-[#3b6d11]"
                        }`}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {age} mnt
                      </span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="flex-1 px-4 py-3 space-y-2.5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 pb-2.5 border-b border-dashed border-[#f0ebe2] last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-[13.5px] font-bold text-[#1c1c18] leading-snug">
                            {item.product.name}
                          </p>
                          {item.sauce && (
                            <span className="inline-flex items-center mt-1 px-2 py-0.5 bg-[#fff8f5] border border-[#f0d4c0] rounded-full text-[10px] font-semibold text-[#993c1d]">
                              {item.sauce.name}
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[20px] font-extrabold text-[#1c1c18] leading-none">
                            {item.weight ? item.weight : item.quantity} {item.weight ? "kg" : "porsi"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action button */}
                  <div className="px-4 pb-4 pt-1">
                    <KitchenCardButton orderId={order.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}