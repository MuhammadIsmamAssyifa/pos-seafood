import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import ProductImage from "@/components/ProductImage";

export default async function MenuListPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Daftar Menu</h1>
          <p className="text-muted-foreground">
            Kelola harga dan ketersediaan menu.
          </p>
        </div>
        <Link href="/daftar-menu/create">
          <Button className="bg-orange-600 hover:bg-orange-700 gap-2 font-bold">
            <Plus className="w-4 h-4" /> Tambah Menu Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[300px]">Nama Menu</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga Base</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center gap-4">
                  {product.imageUrl ? (
                    <ProductImage src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div className="w-[50px] h-[50px] bg-slate-200 rounded-md flex items-center justify-center text-[10px] text-slate-400">
                      No Image
                    </div>
                  )}
                  <span className="font-bold">{product.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {product.category.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  Rp {Number(product.basePrice).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      product.unit === "KG"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }
                    variant="secondary"
                  >
                    Per {product.unit}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
