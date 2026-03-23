import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import KitchenCardButton from "@/components/KitchenCard";

export const revalidate = 10;

export default async function KitchenPage() {
  const activeOrders = await prisma.order.findMany({
    where: { status: "OPEN" },
    include: {
      items: {
        include: {
          product: true,
          sauce: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <UtensilsCrossed className="w-8 h-8 text-orange-500" /> MONITOR DAPUR
        </h1>
        <Badge variant="outline" className="text-zinc-400 border-zinc-700">
          Live Update (10s)
        </Badge>
      </div>

      {activeOrders.length === 0 ? (
        <div className="text-center py-40 opacity-20">
          <h2 className="text-2xl font-bold italic">
            Dapur Tenang... Belum ada pesanan masuk.
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeOrders.map((order) => (
            <Card
              key={order.id}
              className="bg-zinc-900 border-zinc-800 shadow-2xl relative overflow-hidden"
            >
              {/* Tanda Meja di Pojok Atas */}
              <div className="absolute top-0 right-0 p-3 bg-orange-600 text-white font-black text-2xl rounded-bl-xl shadow-lg">
                #{order.tableNumber}
              </div>

              <CardHeader className="p-4 border-b border-zinc-800">
                <CardTitle className="text-lg text-zinc-100 uppercase tracking-wider">
                  {order.customerName}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b border-zinc-800/50 pb-2"
                    >
                      <div>
                        <p className="font-bold text-lg text-orange-400 leading-tight">
                          {item.product.name}
                        </p>
                        {item.sauce && (
                          <Badge className="mt-1 bg-zinc-700 hover:bg-zinc-700 text-zinc-200">
                            SAUS: {item.sauce.name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-white">
                          {item.weight
                            ? `${item.weight} kg`
                            : `${item.quantity} x`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <KitchenCardButton orderId={order.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
