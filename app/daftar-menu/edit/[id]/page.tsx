import { prisma } from "@/lib/prisma";
import { updateProduct } from "@/app/actions/product";
import { notFound } from "next/navigation";
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
import AvailabilitySwitch from "@/components/AvailabilitySwitch";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const allSauces = await prisma.sauce.findMany();
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: id },
      include: {
        allowedSauces: true,
      },
    }),
    prisma.category.findMany(),
  ]);

  if (!product) notFound();

  const updateActionWithId = updateProduct.bind(null, product.id);

  return (
    <form action={updateActionWithId} className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/daftar-menu">
            <Button variant="outline" size="icon" type="button">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Menu: {product.name}
          </h1>
        </div>
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
                defaultValue={product.name}
                placeholder="Contoh: Kepiting Jumbo Saus Padang"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold">Kategori</label>
                <Select
                  defaultValue={product.categoryId.toString()}
                  name="categoryId"
                  required
                >
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
                <Select defaultValue={product.unit} name="unit" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PCS">Per Porsi (PCS)</SelectItem>
                    <SelectItem value="KG">Per Kilogram (KG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AvailabilitySwitch defaultValue={product.isAvailable} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold">
                  Harga Modal / Base (Rp)
                </label>
                <Input
                  name="basePrice"
                  type="number"
                  defaultValue={Number(product.basePrice)}
                  placeholder="Harga dari toko ikan"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold">
                  Harga Jual / Menu (Rp)
                </label>
                <Input
                  name="sellingPrice"
                  type="number"
                  defaultValue={Number(product.sellingPrice)}
                  placeholder="Harga di daftar menu"
                  className="border-orange-200 focus:border-orange-500"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KOLOM KANAN: FORM FOTO */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Foto Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <MenuFormWrapper initialImage={product.imageUrl || ""} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3 bg-white p-6 rounded-xl border border-[#e2ddd6]">
        <h3 className="text-sm font-bold text-[#5a5040]">
          Opsi Saus & Biaya Tambahan
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {allSauces.map((sauce) => {
            const existingRelation = product?.allowedSauces?.find(
              (as) => as.sauceId === sauce.id,
            );

            return (
              <div
                key={sauce.id}
                className="flex items-center gap-4 p-3 border border-[#f0ebe2] rounded-lg hover:bg-[#faf8f5]"
              >
                <input
                  type="checkbox"
                  name="sauceIds"
                  value={sauce.id}
                  className="w-4 h-4 accent-orange-600"
                  defaultChecked={!!existingRelation}
                />
                <span className="text-sm font-medium flex-1">{sauce.name}</span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#a09888]">+ Rp</span>
                  <input
                    type="number"
                    name={`extraPrice_${sauce.id}`}
                    placeholder="0"
                    defaultValue={existingRelation?.extraPrice || 0}
                    className="w-24 p-1 text-sm border-b border-[#e2ddd6] outline-none bg-transparent focus:border-orange-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
}
