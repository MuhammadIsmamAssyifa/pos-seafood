// app/pengaturan/_components/SauceTable.tsx
import { deleteSauce, updateSauce, createSauce } from "@/app/actions/master";
import { MasterFormModal } from "./MasterFormModal";
import DeleteButton from "./DeleteButton";
import { Flame } from "lucide-react";

export default function SauceTable({ data }: { data: any[] }) {
  return (
    <section className="mt-4 h-full">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-[14px] font-bold text-[#1c1c18]">Pilihan Saus</h2>
          <p className="text-[11px] text-[#a09888] mt-0.5">
            {data.length} saus terdaftar
          </p>
        </div>
        <MasterFormModal title="Saus" action={createSauce} />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden h-full">
        <div className="grid grid-cols-2 px-5 py-4 bg-[#faf8f5] border-b border-[#f0ebe2]">
          <span className="text-[10px] font-bold uppercase tracking-[.7px] text-[#a09888]">
            Nama Saus
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[.7px] text-[#a09888] text-right">
            Aksi
          </span>
        </div>

        {data.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-2">
            <Flame className="w-8 h-8 text-[#e2ddd6]" />
            <p className="text-sm font-medium text-[#c8c0b4]">
              Belum ada data saus
            </p>
          </div>
        ) : (
          data.map((sauce, i) => (
            <div
              key={sauce.id}
              className={`grid grid-cols-2 text-[13px] px-5 py-2 items-center hover:bg-[#faf8f5] transition-colors ${
                i < data.length - 1 ? "border-b border-[#f5f2ed]" : ""
              }`}
            >
              <p className="text-[13.5px] font-semibold text-[#1c1c18]">
                {sauce.name}
              </p>
              <div className="flex items-center justify-end gap-1.5 min-w-[90px]">
                <MasterFormModal
                  title="Saus"
                  initialName={sauce.name}
                  action={updateSauce.bind(null, sauce.id)}
                />
                <DeleteButton id={sauce.id} action={deleteSauce} />
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-[11px] text-[#c8c0b4] italic mt-2.5 px-1">
        * Saus yang sudah terhubung ke produk tidak bisa dihapus.
      </p>
    </section>
  );
}
