import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import MenuListClient from "@/components/MenuListClient";

export default async function MenuListPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const safeCategories = categories.map((c) => ({
    ...c,
    orderBy: { name: "asc" },
    id: c.id.toString(),
  }));

  const safeProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    sellingPrice: Number(p.sellingPrice),
    category: {
      ...p.category,
      id: p.category.id.toString(),
    },
  }));

  return (
    <div className="p-5 md:p-8 bg-white min-h-screen font-['Sora',sans-serif]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-[18px] md:text-xl font-extrabold text-[#1c1c18] tracking-tight">
            Daftar Menu
          </h1>
          <p className="text-xs text-[#a09888] mt-1">
            Kelola harga dan ketersediaan menu restoran
          </p>
        </div>
        <Link
          href="/daftar-menu/create"
          className="flex items-center gap-2 bg-[#c45c1a] hover:bg-[#a84a14] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Menu Baru
        </Link>
      </div>

      <MenuListClient products={safeProducts} categories={safeCategories} />
    </div>
  );
}
