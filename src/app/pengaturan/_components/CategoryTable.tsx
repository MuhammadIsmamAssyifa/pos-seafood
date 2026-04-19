// app/pengaturan/_components/CategoryTable.tsx
import {
  deleteCategory,
  updateCategory,
  createCategory,
} from "@/app/actions/master";
import { MasterFormModal } from "./MasterFormModal";
import DeleteButton from "./DeleteButton";
import { Tag } from "lucide-react";

export default function CategoryTable({ data }: { data: any[] }) {
  return (
    <section className="mt-4 h-full">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-[14px] font-bold text-[#1c1c18]">
            Kategori Menu
          </h2>
          <p className="text-[11px] text-[#a09888] mt-0.5">
            {data.length} kategori terdaftar
          </p>
        </div>
        <MasterFormModal title="Kategori" action={createCategory} />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden h-full">
        <div className="grid grid-cols-2 px-5 py-4 bg-[#faf8f5] border-b border-[#f0ebe2]">
          <div className="text-[10px] font-bold uppercase tracking-[.7px] text-[#a09888]">
            Nama Kategori
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[.7px] text-[#a09888] text-right">
            Aksi
          </div>
        </div>

        {data.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <Tag className="w-8 h-8 text-[#e2ddd6]" />
            <p className="text-sm font-medium text-[#c8c0b4]">
              Belum ada kategori
            </p>
          </div>
        ) : (
          data.map((cat, i) => (
            <div
              key={cat.id}
              className={`grid grid-cols-2 px-5 py-2 items-center hover:bg-[#faf8f5] transition-colors ${
                i < data.length - 1 ? "border-b border-[#f5f2ed]" : ""
              }`}
            >
              <div>
                <p className="text-[13.5px] font-semibold text-[#1c1c18]">
                  {cat.name}
                </p>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <MasterFormModal
                  title="Kategori"
                  initialName={cat.name}
                  action={updateCategory.bind(null, cat.id)}
                />
                <DeleteButton id={cat.id} action={deleteCategory} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
