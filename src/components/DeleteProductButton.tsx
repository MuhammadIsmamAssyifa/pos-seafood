"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-8 h-8 rounded-lg border border-[#e2ddd6] bg-white hover:bg-[#fcebeb] hover:border-[#f09595] flex items-center justify-center transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-[#e24b4a]" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogMedia className="text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus Menu?</AlertDialogTitle>
          <AlertDialogDescription>
            Menu <span className="font-semibold">"{name}"</span> akan dihapus
            permanen. Tindakan ini tidak bisa dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteProduct(id);
              window.location.reload();
            }}
            variant="destructive"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
