// app/pengaturan/page.tsx
import { prisma } from "@/lib/prisma";
import CategoryTable from "@/app/actions/pengaturan/_components/CategoryTable";
import SauceTable from "@/app/actions/pengaturan/_components/SauceTable";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const [categories, sauces] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.sauce.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-5 md:p-8 min-h-screen font-['Sora',sans-serif]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-[#fff3eb] border border-[#f0d4c0] rounded-xl flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#c45c1a]" />
          </div>
          <div>
            <h1 className="text-[18px] font-extrabold text-[#1c1c18] tracking-tight">
              Pengaturan
            </h1>
            <p className="text-xs text-[#a09888] mt-0.5">
              Kelola kategori menu dan pilihan saus
            </p>
          </div>
        </div>

        {/* Two sections stacked — cleaner than tabs for this amount of content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryTable data={categories} />
          <SauceTable data={sauces} />
        </div>
      </div>
    </div>
  );
}
