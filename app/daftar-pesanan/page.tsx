import { prisma } from "@/lib/prisma";
import ActiveOrdersClient from "@/app/kasir/_components/ActiveOrdersClient";

export const revalidate = 0;

export default async function ActiveOrdersPage() {
  const activeOrders = await prisma.order.findMany({
    where: {
      status: "OPEN", // Hanya meja yang belum bayar
    },
    include: {
      items: true, // Untuk menghitung total tagihan per meja
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-[#1c1c18]">
            MONITOR PESANAN AKTIF
          </h1>
          <p className="text-sm text-[#a09888]">
            Daftar meja yang sedang berlangsung dan siap bayar
          </p>
        </header>

        {/* Kirim data ke Client Component untuk interaksi Modal */}
        <ActiveOrdersClient initialOrders={activeOrders} />
      </div>
    </div>
  );
}
