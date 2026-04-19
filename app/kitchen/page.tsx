import { prisma } from "@/lib/prisma";
import { UtensilsCrossed, Clock, Users } from "lucide-react";
import KitchenCardButton from "@/components/KitchenCard";

export const revalidate = 10;

function minutesAgo(date: Date) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

export default async function KitchenPage() {
  const activeOrders = await prisma.order.findMany({
    where: {
      status: "OPEN",
      items: {
        some: { status: { in: ["PENDING", "COOKING"] } },
      },
    },
    include: {
      items: {
        where: { status: { in: ["PENDING", "COOKING"] } },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] font-['Sora',sans-serif] p-4 md:p-8">
      {/* Header Monitor */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-[#e8e2d8]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-[#e8e2d8] rounded-2xl shadow-sm">
            <UtensilsCrossed className="w-6 h-6 text-[#c45c1a]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1c1c18]">MONITOR DAPUR</h1>
            <p className="text-xs text-[#a09888] font-medium uppercase tracking-wider">
              Antrean Masakan Aktif
            </p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 border border-[#e8e2d8] rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-bold text-[#5a5040]">
            {activeOrders.length} Pesanan
          </span>
        </div>
      </div>

      {/* Grid Kartu Pesanan */}
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-30">
          <UtensilsCrossed className="w-16 h-16 mb-4" />
          <p className="font-bold">Dapur sedang santai...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeOrders.map((order) => {
            const age = minutesAgo(order.createdAt);
            const isUrgent = age >= 15;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl border-2 flex flex-col overflow-hidden transition-all ${isUrgent ? "border-red-200 shadow-lg shadow-red-50/50" : "border-[#e8e2d8]"}`}
              >
                {/* Meja & Info */}
                <div className="p-5 border-b border-[#f0ebe2] relative">
                  <div className="absolute top-0 right-0 bg-[#1c1c18] text-white px-5 py-2 rounded-bl-2xl font-black text-xl">
                    #{order.tableNumber}
                  </div>
                  <h3 className="font-black text-[#c45c1a] uppercase truncate pr-16">
                    {order.customerName}
                  </h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[11px] font-bold text-[#a09888] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {age} Menit
                    </span>
                    <span className="text-[11px] font-bold text-[#a09888] flex items-center gap-1">
                      <Users className="w-3 h-3" /> {order.customerCount} Org
                    </span>
                  </div>
                </div>

                {/* List Menu (Snapshot) */}
                <div className="flex-1 p-5 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start group"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#1c1c18] leading-tight">
                          {item.productName}
                        </p>
                        {item.sauceName && (
                          <span className="text-[10px] font-black text-[#c45c1a] uppercase bg-[#fff8f5] px-1.5 py-0.5 rounded border border-[#f0d4c0] mt-1 inline-block">
                            {item.sauceName}
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-2">
                        <span className="text-lg font-black text-[#1c1c18]">
                          {item.weight ? Number(item.weight) : item.quantity}
                          <small className="text-[10px] ml-1">
                            {item.weight ? "KG" : "PCS"}
                          </small>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Tombol */}
                <div className="p-4 bg-[#faf8f5] border-t border-[#f0ebe2]">
                  <KitchenCardButton orderId={order.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
