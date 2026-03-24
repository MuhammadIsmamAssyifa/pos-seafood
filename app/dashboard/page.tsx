import { prisma } from "@/lib/prisma";
import { DollarSign, ShoppingBag, Utensils, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const sales = await prisma.order.findMany({
    where: { status: "PAID" },
    include: { items: { include: { product: true } } },
  });

  const totalRevenue = sales.reduce((acc, order) => {
    const orderTotal = order.items.reduce((sum, item: any) => {
      const price = Number(item.product.basePrice);
      return sum + (item.weight ? price * item.weight : price * item.quantity);
    }, 0);
    return acc + orderTotal;
  }, 0);

  const totalOrders = await prisma.order.count();
  const totalProducts = await prisma.product.count();

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: { include: { product: true } } },
  });

  const stats = [
    {
      label: "Total Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      desc: "Dari pesanan lunas",
      trend: "+12%",
      icon: DollarSign,
      color: "green" as const,
    },
    {
      label: "Pesanan Masuk",
      value: `${totalOrders}`,
      desc: "Total transaksi terdaftar",
      trend: "+5",
      icon: ShoppingBag,
      color: "orange" as const,
    },
    {
      label: "Menu Aktif",
      value: `${totalProducts}`,
      desc: "Jenis makanan & minuman",
      trend: "Stabil",
      icon: Utensils,
      color: "blue" as const,
    },
  ];

  const colorMap = {
    green: {
      card: "bg-[#151510] hover:border-[#333328]",
      icon: "bg-[#1a2e1a] text-[#5aa55a]",
      trend: "bg-[#1a2e1a] text-[#5aa55a]",
      glow: "before:bg-[#5aa55a]",
    },
    orange: {
      card: "bg-[#151510] hover:border-[#333328]",
      icon: "bg-[#2e1e10] text-[#e8733a]",
      trend: "bg-[#2e1e10] text-[#e8733a]",
      glow: "before:bg-[#e8733a]",
    },
    blue: {
      card: "bg-[#151510] hover:border-[#333328]",
      icon: "bg-[#101e2e] text-[#4a8fd4]",
      trend: "bg-[#222218] text-[#6a6a50]",
      glow: "before:bg-[#4a8fd4]",
    },
  };

  const statusMap: Record<string, { label: string; class: string }> = {
    PAID: { label: "Lunas", class: "bg-[#1a2e1a] text-[#5aa55a]" },
    COOKING: { label: "Dapur", class: "bg-[#2e1e10] text-[#e8733a]" },
    PENDING: { label: "Antre", class: "bg-[#101e2e] text-[#4a8fd4]" },
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-slate-50 min-h-screen font-['Sora',sans-serif]">
      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Owner
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan performa restoran hari ini
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Live ·{" "}
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => {
          const colorMap = {
            green: {
              icon: "bg-green-100 text-green-600",
              trend: "bg-green-100 text-green-600",
            },
            orange: {
              icon: "bg-orange-100 text-orange-600",
              trend: "bg-orange-100 text-orange-600",
            },
            blue: {
              icon: "bg-blue-100 text-blue-600",
              trend: "bg-blue-100 text-blue-600",
            },
          };

          const c = colorMap[s.color];

          return (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.7px] text-slate-500 font-semibold">
                  {s.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.icon}`}
                >
                  <s.icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-2xl font-bold text-slate-900 mb-3">
                {s.value}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{s.desc}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.trend}`}
                >
                  {s.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4">
        {/* LEFT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Penjualan Mingguan
            </h2>
            <button className="text-[11px] text-slate-500 border border-slate-200 rounded-lg px-3 py-1 hover:bg-slate-100">
              7 hari terakhir
            </button>
          </div>

          {/* Chart */}
          <div className="flex items-end gap-1.5 h-32 pt-2">
            {[
              { day: "Sen", h: 45 },
              { day: "Sel", h: 62 },
              { day: "Rab", h: 38 },
              { day: "Kam", h: 80 },
              { day: "Jum", h: 55 },
              { day: "Sab", h: 92 },
              { day: "Min", h: 70, active: true },
            ].map((b) => (
              <div
                key={b.day}
                className="flex flex-col items-center flex-1 gap-1"
              >
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className={`w-full max-w-7 rounded-t-md ${
                      b.active ? "bg-orange-500" : "bg-slate-200"
                    }`}
                    style={{ height: `${b.h}%` }}
                  />
                </div>
                <span className="text-[9.5px] text-slate-400">{b.day}</span>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-xs font-semibold text-slate-800 mb-3">
              Pesanan Terakhir
            </h3>
            <div className="space-y-2">
              {recentOrders.map((order) => {
                const statusMap = {
                  PAID: "bg-green-100 text-green-600",
                  COOKING: "bg-orange-100 text-orange-600",
                  PENDING: "bg-blue-100 text-blue-600",
                };

                const names = order.items
                  .map((i: any) => i.product.name)
                  .join(", ");

                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-xs font-bold text-orange-600 w-8">
                      #{String(order.id).slice(-3)}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-medium text-slate-800 truncate">
                        {names}
                      </p>
                      <p className="text-[10.5px] text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                        statusMap[order.status as keyof typeof statusMap] ??
                        "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Menu Terlaris
            </h2>
            <button className="text-[11px] text-[#5a5a48] border border-[#2a2a1e] rounded-lg px-3 py-1 hover:border-[#444438] hover:text-[#a0a088] transition-colors">
              Hari ini
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Cumi Saus Tiram", count: 14, pct: 100 },
              { name: "Udang Goreng Tepung", count: 11, pct: 78 },
              { name: "Ikan Bakar Kecap", count: 9, pct: 64 },
              { name: "Kepiting Saus Padang", count: 7, pct: 50 },
              { name: "Es Kelapa Muda", count: 5, pct: 35 },
            ].map((m, i) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-[11px] text-[#3a3a2e] font-semibold w-4 text-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-800 w-32 truncate shrink-0">
                  {m.name}
                </span>
                <div className="flex-1 h-1.5 bg-slate-200 border border-slate-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e8733a] rounded-full opacity-70"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#5a5a48] w-8 text-right shrink-0">
                  x{m.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
