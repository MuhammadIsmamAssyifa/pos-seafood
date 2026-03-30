// app/pengaturan/_components/DeleteButton.tsx
"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteButton({
  id,
  action,
}: {
  id: number;
  action: any;
}) {
  return (
    <button
      className="w-[30px] h-[30px] p-2 rounded-lg border border-[#e2ddd6] bg-white hover:bg-[#fcebeb] hover:border-[#f09595] flex items-center justify-center transition-colors"
      onClick={async () => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;
        try {
          await action(id);
          toast.success("Data berhasil dihapus");
        } catch (err: any) {
          toast.error(err.message ?? "Gagal menghapus data");
        }
      }}
    >
      <Trash2 className="w-3.5 h-3.5 text-[#e24b4a]"/>
    </button>
  );
}
