"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChefHat,
} from "lucide-react";
import ProductImage from "@/components/ProductImage";
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

type Product = {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  imageUrl: string | null;
  category: { id: string; name: string };
};

type SortKey = "name" | "price" | "category";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

export default function MenuListClient({
  products,
  categories,
}: {
  products: Product[];
  categories: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#c45c1a]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#c45c1a]" />
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim())
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    if (categoryFilter !== "all")
      list = list.filter((p) => p.category.id === categoryFilter);
    if (unitFilter !== "all") list = list.filter((p) => p.unit === unitFilter);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name, "id");
      if (sortKey === "price") cmp = a.basePrice - b.basePrice;
      if (sortKey === "category")
        cmp = a.category.name.localeCompare(b.category.name, "id");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [products, search, categoryFilter, unitFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const thClass =
    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.7px] text-[#a09888] select-none";
  const thBtn = `${thClass} cursor-pointer hover:text-[#5a5040] transition-colors`;

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 flex-wrap mb-4">
        <div className="flex items-center gap-2 bg-white border border-[#e2ddd6] rounded-xl px-3.5 h-10 flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 text-[#a09888] shrink-0" />
          <input
            className="flex-1 text-sm outline-none bg-transparent text-[#1c1c18] placeholder:text-[#c8c0b4]"
            placeholder="Cari nama menu..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="h-10 px-3 border border-[#e2ddd6] rounded-xl bg-white text-[12.5px] text-[#5a5040] outline-none cursor-pointer"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="h-10 px-3 border border-[#e2ddd6] rounded-xl bg-white text-[12.5px] text-[#5a5040] outline-none cursor-pointer"
          value={unitFilter}
          onChange={(e) => {
            setUnitFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Semua Unit</option>
          <option value="KG">Per KG</option>
          <option value="PCS">Per Porsi</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] md:min-w-0">
            <thead>
              <tr className="bg-[#faf8f5] border-b border-[#f0ebe2]">
                <th className="px-5 py-3 text-left w-[280px]">
                  <button className={thBtn} onClick={() => handleSort("name")}>
                    Nama Menu <SortIcon k="name" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    className={thBtn}
                    onClick={() => handleSort("category")}
                  >
                    Kategori <SortIcon k="category" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button className={thBtn} onClick={() => handleSort("price")}>
                    Harga Base <SortIcon k="price" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <span className={thClass}>Unit</span>
                </th>
                <th className="px-5 py-3 text-right">
                  <span className={thClass + " justify-end"}>Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-[#f5f2ed] rounded-xl flex items-center justify-center border border-[#e8e2d8]">
                        <ChefHat className="w-5 h-5 text-[#c8c0b4]" />
                      </div>
                      <p className="text-sm font-semibold text-[#a09888]">
                        Menu tidak ditemukan
                      </p>
                      <p className="text-xs text-[#c8c0b4]">
                        Coba ubah kata kunci atau filter
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#f5f2ed] hover:bg-[#faf8f5] transition-colors last:border-0"
                  >
                    {/* Name + image */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#f5f2ed] border border-[#e8e2d8] overflow-hidden flex items-center justify-center shrink-0">
                          {product.imageUrl ? (
                            <ProductImage
                              src={product.imageUrl}
                              alt={product.name}
                              variant="fixed"
                            />
                          ) : (
                            <ChefHat className="w-4.5 h-4.5 text-[#c8c0b4]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-bold text-[#1c1c18] leading-snug">
                            {product.name}
                          </p>
                          <p className="text-[10.5px] text-[#c8c0b4] mt-0.5">
                            {product.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-600 bg-[#f5f2ed] border border-[#e2ddd6] text-[#5a5040]">
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="text-[13.5px] font-bold text-[#1c1c18]">
                        Rp {product.basePrice.toLocaleString("id-ID")}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          product.unit === "KG"
                            ? "bg-[#fff3eb] border-[#f0d4c0] text-[#993c1d]"
                            : "bg-[#eaf3de] border-[#c0dd97] text-[#3b6d11]"
                        }`}
                      >
                        Per {product.unit}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/daftar-menu/${product.id}/edit`}
                          className="w-8 h-8 rounded-lg border border-[#e2ddd6] bg-white hover:bg-[#f5f2ed] hover:border-[#c8c0b4] flex items-center justify-center transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#5a5040]" />
                        </Link>
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
                                Menu{" "}
                                <span className="font-semibold">
                                  "{product.name}"
                                </span>{" "}
                                akan dihapus permanen. Tindakan ini tidak bisa
                                dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await deleteProduct(product.id);
                                }}
                                variant="destructive"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0ebe2] bg-[#faf8f5] flex-wrap gap-3">
          <span className="text-xs text-[#a09888]">
            Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}{" "}
            menu
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 rounded-lg border border-[#e2ddd6] bg-white flex items-center justify-center disabled:opacity-40 hover:bg-[#f5f2ed] transition-colors"
            >
              <ArrowDown className="w-3 h-3 text-[#5a5040] rotate-90" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
              )
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                  acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`e-${i}`}
                    className="w-7 text-center text-xs text-[#a09888]"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-7 h-7 rounded-lg border text-xs font-semibold transition-colors ${
                      page === p
                        ? "bg-[#c45c1a] border-[#c45c1a] text-white"
                        : "bg-white border-[#e2ddd6] text-[#5a5040] hover:bg-[#f5f2ed]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 rounded-lg border border-[#e2ddd6] bg-white flex items-center justify-center disabled:opacity-40 hover:bg-[#f5f2ed] transition-colors"
            >
              <ArrowDown className="w-3 h-3 text-[#5a5040] -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
