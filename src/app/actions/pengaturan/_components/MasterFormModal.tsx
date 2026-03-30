// app/pengaturan/_components/MasterFormModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2 } from "lucide-react";

interface MasterFormProps {
  title: string;
  initialName?: string;
  action: (formData: FormData) => Promise<void>;
}

export function MasterFormModal({
  title,
  initialName,
  action,
}: MasterFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await action(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {initialName ? (
          <button className="w-[30px] h-[30px] rounded-lg border border-[#e2ddd6] bg-white hover:bg-[#f5f2ed] hover:border-[#c8c0b4] flex items-center justify-center transition-colors">
            <Edit2 className="w-3.5 h-3.5 text-[#5a5040]" />
          </button>
        ) : (
          <button className="flex items-center gap-2 bg-[#c45c1a] hover:bg-[#a84a14] text-white text-[12.5px] font-bold px-4 py-2 rounded-xl transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Tambah {title}
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm rounded-2xl border border-[#e8e2d8] p-4 overflow-hidden font-['Sora',sans-serif]">
        <div className="px-6 pt-6 pb-2">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-bold text-[#1c1c18]">
              {initialName ? "Edit" : "Tambah"} {title}
            </DialogTitle>
            <p className="text-xs text-[#a09888] mt-1">
              {initialName
                ? `Ubah nama ${title.toLowerCase()} ini`
                : `Isi nama ${title.toLowerCase()} baru`}
            </p>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[.6px] text-[#a09888] mb-2">
              Nama {title}
            </label>
            <input
              name="name"
              defaultValue={initialName}
              placeholder={`cth: ${title === "Kategori" ? "Seafood, Minuman..." : "Saus Tiram, Lada Hitam..."}`}
              required
              className="w-full h-10 px-3.5 text-sm border border-[#e2ddd6] rounded-xl outline-none focus:border-[#c45c1a] bg-white text-[#1c1c18] placeholder:text-[#c8c0b4] font-['Sora',sans-serif] transition-colors"
            />
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 h-10 rounded-xl border border-[#e2ddd6] bg-[#faf8f5] text-[13px] font-semibold text-[#7a7060] hover:bg-[#f0ebe2] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-10 p-2 rounded-xl bg-[#c45c1a] text-white text-[13px] font-bold hover:bg-[#a84a14] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Menyimpan..." : `Simpan ${title}`}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
