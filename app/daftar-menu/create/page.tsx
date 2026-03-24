import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import MenuFormWrapper from "@/components/MenuForm";
import { createProduct } from "@/app/actions/product";

export default async function CreateMenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <form action={createProduct} className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/daftar-menu">
            <Button variant="outline" size="icon" type="button">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Tambah Menu Baru
          </h1>
        </div>
        {/* Pastikan type="submit" agar menjalankan Server Action */}
        <Button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 gap-2 font-bold"
        >
          <Save className="w-4 h-4" /> Simpan Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Nama Menu</label>
              <Input
                name="name"
                placeholder="Contoh: Kepiting Jumbo Saus Padang"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Kategori</label>
                <Select name="categoryId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Satuan (Unit)</label>
                <Select name="unit" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCS">Per Porsi (PCS)</SelectItem>
                    <SelectItem value="KG">Per Kilogram (KG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold">Harga Base (Rp)</label>
              <Input name="price" type="number" placeholder="50000" required />
            </div>
          </CardContent>
        </Card>

        {/* KOLOM KANAN: FORM FOTO */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Foto Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <MenuFormWrapper />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
