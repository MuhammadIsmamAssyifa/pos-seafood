import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Utensils } from "lucide-react";

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

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Owner</h1>

      {/* KARTU STATISTIK */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-muted-foreground">
              Dari pesanan berstatus Lunas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pesanan Masuk</CardTitle>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total transaksi terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Menu Aktif</CardTitle>
            <Utensils className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Jenis makanan & minuman
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AREA GRAFIK / TABEL NANTI DI SINI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aktivitas Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Nanti kita pasang grafik penjualan mingguan di sini.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
