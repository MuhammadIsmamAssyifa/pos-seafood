"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Trash2,
  Plus,
  Minus,
  Search,
  ChefHat,
  ShoppingCart,
} from "lucide-react";
import { createOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
import { useCartStore } from "@/hooks/use-cart-store";
import { useEffect } from "react";

export default function PosClient({
  products,
}: {
  products: any[];
  sauces: any[];
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerCount, setCustomerCount] = useState(1);
  const [tableNumber, setTableNumber] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isSausModalOpen, setIsSausModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const setCartStore = useCartStore((state) => state.setCart);
  const { isCartOpen, setIsCartOpen } = useCartStore();

  useEffect(() => {
    setCartStore(cart);
  }, [cart, setCartStore]);

  const filtered = products
    .filter((p) => p.isAvailable)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddClick = (product: any) => {
    const productHasSauces =
      product.allowedSauces && product.allowedSauces.length > 0;

    if (productHasSauces) {
      setSelectedProduct(product);
      setIsSausModalOpen(true);
    } else {
      addToCart(product, null);
    }
  };

  const addToCart = (product: any, sauceId: number | null) => {
    const sauceInfo = product.allowedSauces?.find(
      (s: any) => s.sauce.id === sauceId,
    );

    const sauceName = sauceInfo?.sauce.name || null;
    const extraPrice = sauceInfo?.extraPrice || 0;

    const finalPrice = Number(product.sellingPrice) + Number(extraPrice);

    const cartId = `${product.id}-${sauceId || "no-sauce"}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);

      if (existing) {
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...product,
          basePrice: finalPrice,
          cartId,
          sauceId,
          sauceName,
          extraPrice,
          quantity: 1,
          weight: product.unit === "KG" ? 1 : null,
        },
      ];
    });

    setIsSausModalOpen(false);
    setSelectedProduct(null);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart(
      cart.map((i) =>
        i.cartId === cartId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i,
      ),
    );
  };

  const updateWeight = (cartId: string, weight: number) => {
    setCart(cart.map((i) => (i.cartId === cartId ? { ...i, weight } : i)));
  };

  const total = cart.reduce((sum, item) => {
    const price = Number(item.basePrice);
    return (
      sum +
      (item.unit === "KG" ? price * (item.weight || 0) : price * item.quantity)
    );
  }, 0);

  const itemSubtotal = (item: any) => {
    const price = Number(item.basePrice);
    return item.unit === "KG"
      ? price * (item.weight || 0)
      : price * item.quantity;
  };

  const handleProcessOrder = async () => {
    if (!customerName || !tableNumber) {
      alert("Nama Pelanggan dan Nomor Papan wajib diisi!");
      return;
    }
    setLoading(true);

    const itemsToSubmit = cart.map((item) => ({
      productId: item.id,
      productName: item.name,
      sauceId: item.sauceId ?? null,
      sauceName: item.sauceName ?? null,
      priceAtTime: item.basePrice,
      quantity: item.quantity,
      weight: item.unit === "KG" ? item.weight : null,
      subtotal: itemSubtotal(item),
    }));

    const result = await createOrder(
      "cl-admin-123",
      Number(tableNumber),
      customerName,
      customerCount,
      itemsToSubmit,
    );

    if (result.success) {
      alert(`Pesanan Berhasil! ID: ${result.orderId}`);
      setCart([]);
      setCustomerName("");
      setTableNumber("");
      router.refresh();
    } else {
      alert("Gagal: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-white font-['Sora',sans-serif] overflow-hidden">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent
          side="right"
          className="p-0 w-full sm:max-w-[340px] border-l-[#e8e2d8]"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Keranjang Pesanan</SheetTitle>
            <SheetDescription>Detail item yang akan dipesan</SheetDescription>
          </SheetHeader>
          <CartSidebarContent
            cart={cart}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerCount={customerCount}
            setCustomerCount={setCustomerCount}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            removeFromCart={removeFromCart}
            updateQty={updateQty}
            updateWeight={updateWeight}
            itemSubtotal={itemSubtotal}
            total={total}
            loading={loading}
            handleProcessOrder={handleProcessOrder}
          />
        </SheetContent>
      </Sheet>
      {/* ── LEFT: Product Grid ── */}
      <div className="flex-1 overflow-y-auto p-5 md:p-7">
        {/* Search bar */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-white border border-[#e2ddd6] rounded-xl px-4 h-10">
            <Search className="w-4 h-4 text-[#a09888] shrink-0" />
            <input
              className="flex-1 text-sm outline-none bg-transparent text-[#1c1c18] placeholder:text-[#c8c0b4]"
              placeholder="Cari menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[.8px] font-bold text-[#1c1c18] mb-3">
          Menu Tersedia · {filtered.length} item
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((product) => (
            <button
              key={product.id}
              onClick={() => handleAddClick(product)}
              className="group text-left bg-white border border-[#e8e2d8] rounded-2xl p-4 transition-all duration-150 hover:border-[#c45c1a] hover:shadow-[0_2px_12px_rgba(196,92,26,0.12)] active:scale-[.97]"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-full aspect-square mb-2">
                  {product.imageUrl ? (
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.name}
                      variant="fill"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f5f2ed] rounded-md flex items-center justify-center text-[10px] text-slate-400">
                      <ChefHat className="w-[50px] h-[50px] text-[#c8c0b4]" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[13px] font-semibold text-[#1c1c18] leading-snug mb-1">
                {product.name}
              </p>
              <div className="flex justify-between">
                <p className="text-[14px] font-bold text-[#c45c1a]">
                  Rp {product.basePrice.toLocaleString("id-ID")}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide mb-2",
                    product.unit === "KG"
                      ? "bg-[#fff3eb] text-[#993c1d]"
                      : "bg-[#eaf3de] text-[#3b6d11]",
                  )}
                >
                  {product.unit === "KG" ? "Per KG" : "Porsi"}
                </span>
              </div>
              <div className="mt-3 w-full py-1.5 rounded-lg text-[11px] font-semibold bg-[#fff8f5] border border-[#f0d4c0] text-[#c45c1a] group-hover:bg-[#c45c1a] group-hover:text-white group-hover:border-[#c45c1a] transition-colors text-center">
                + Tambah
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sauce Modal ── */}
      <Dialog open={isSausModalOpen} onOpenChange={setIsSausModalOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl border border-[#e8e2d8]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-bold text-[#1c1c18]">
              Pilih Saus
            </DialogTitle>
            <DialogDescription>
              {selectedProduct?.name} — pilih bumbu masak
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {selectedProduct?.allowedSauces?.map((item: any) => (
              <button
                key={item.sauce.id}
                onClick={() => addToCart(selectedProduct, item.sauce.id)}
                className="h-14 rounded-xl border border-[#e2ddd6] bg-white text-sm font-semibold text-[#1c1c18] hover:bg-[#fff8f5] hover:border-[#c45c1a] hover:text-[#c45c1a] transition-all"
              >
                {item.sauce.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsSausModalOpen(false)}
            className="w-full mt-1 py-2.5 rounded-xl border border-[#e2ddd6] bg-[#faf8f5] text-sm text-[#7a7060] font-medium hover:bg-[#f0ebe2] transition-colors"
          >
            Batal
          </button>
        </DialogContent>
      </Dialog>

      {/* ── RIGHT: Cart Panel ── */}
      <aside className="hidden md:flex w-full max-w-[340px] shrink-0 bg-white border-l border-[#e8e2d8] flex flex-col h-screen">
        {/* Cart header */}
        <div className="px-5 py-4 border-b border-[#f0ebe2]">
          <p className="text-[15px] font-bold text-[#1c1c18]">
            Keranjang Pesanan
          </p>
          <p className="text-[11px] text-[#a09888] mt-0.5">
            {cart.length === 0
              ? "Belum ada item"
              : `${cart.length} item ditambahkan`}
          </p>
        </div>

        {/* Customer details */}
        <div className="px-5 py-4 border-b border-[#f0ebe2] bg-white space-y-2.5">
          <p className="text-[10px] uppercase tracking-[.6px] font-bold text-[#1c1c18]">
            Detail Pelanggan
          </p>
          <input
            className="w-full h-9 px-3 text-sm border border-[#e2ddd6] rounded-xl outline-none focus:border-[#c45c1a] bg-white text-[#1c1c18] placeholder:text-[#c8c0b4]"
            placeholder="Nama pelanggan"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="w-full h-9 px-3 text-sm border border-[#e2ddd6] rounded-xl outline-none focus:border-[#c45c1a] bg-white text-[#1c1c18] placeholder:text-[#c8c0b4]"
              type="number"
              placeholder="Jumlah orang"
              value={customerCount}
              onChange={(e) => setCustomerCount(parseInt(e.target.value))}
            />
            <input
              className="w-full h-9 px-3 text-sm border border-[#f0d4c0] rounded-xl outline-none focus:border-[#c45c1a] bg-[#fff8f2] text-[#c45c1a] font-bold text-center placeholder:text-[#f0d4c0]"
              type="number"
              placeholder="No. Meja"
              value={tableNumber}
              onChange={(e) =>
                setTableNumber(
                  e.target.value === "" ? "" : parseInt(e.target.value),
                )
              }
            />
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-[#c8c0b4]">
              <div className="w-12 h-12 rounded-full bg-[#f5f2ed] flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-[#c8c0b4]" />
              </div>
              <p className="text-xs font-medium">Keranjang kosong</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-[#faf8f5] border border-[#ede8e0] rounded-2xl p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-[12.5px] font-semibold text-[#1c1c18] leading-snug">
                        {item.name}
                      </p>
                      {item.sauceName && (
                        <p className="text-[11px] text-[#c45c1a] mt-0.5">
                          {item.sauceName}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="w-6 h-6 rounded-lg bg-[#fff8f5] border border-[#f0d4c0] flex items-center justify-center shrink-0 hover:bg-[#fce8dc] transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-[#c45c1a]" />
                    </button>
                  </div>

                  {item.unit === "KG" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#7a7060]">Berat:</span>
                      <input
                        type="number"
                        step="0.1"
                        className="w-16 h-7 border border-[#e2ddd6] rounded-lg text-center text-sm font-semibold outline-none focus:border-[#c45c1a] text-[#1c1c18]"
                        value={item.weight}
                        onChange={(e) =>
                          updateWeight(item.cartId, parseFloat(e.target.value))
                        }
                      />
                      <span className="text-xs text-[#a09888]">kg</span>
                      <span className="ml-auto text-xs font-bold text-[#1c1c18]">
                        Rp {itemSubtotal(item).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        className="w-7 h-7 rounded-lg border border-[#e2ddd6] bg-white flex items-center justify-center hover:bg-[#f5f2ed] transition-colors"
                        onClick={() => updateQty(item.cartId, -1)}
                      >
                        <Minus className="w-3 h-3 text-[#5a5040]" />
                      </button>
                      <span className="text-sm font-semibold text-[#1c1c18] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-7 h-7 rounded-lg border border-[#e2ddd6] bg-white flex items-center justify-center hover:bg-[#f5f2ed] transition-colors"
                        onClick={() => updateQty(item.cartId, 1)}
                      >
                        <Plus className="w-3 h-3 text-[#5a5040]" />
                      </button>
                      <span className="text-[11px] text-[#a09888]">porsi</span>
                      <span className="ml-auto text-xs font-bold text-[#1c1c18]">
                        Rp {itemSubtotal(item).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#f0ebe2]">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-sm text-[#1c1c18] font-medium">
              Total Tagihan
            </span>
            <span className="text-[22px] font-bold tracking-tight text-[#1c1c18]">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            className="w-full h-12 rounded-2xl bg-[#2d7a3a] text-white text-sm font-bold tracking-wide hover:bg-[#246030] transition-colors disabled:bg-[#b8d4bc] disabled:cursor-not-allowed"
            disabled={cart.length === 0 || loading}
            onClick={handleProcessOrder}
          >
            {loading ? "Menyimpan..." : "Proses & Cetak Nota"}
          </button>
        </div>
      </aside>
    </div>
  );
}

function CartSidebarContent({
  cart,
  customerName,
  setCustomerName,
  customerCount,
  setCustomerCount,
  tableNumber,
  setTableNumber,
  removeFromCart,
  updateQty,
  updateWeight,
  itemSubtotal,
  total,
  loading,
  handleProcessOrder,
}: any) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Cart header */}
      <div className="px-5 py-4 border-b border-[#f0ebe2]">
        <p className="text-[15px] font-bold text-[#1c1c18]">
          Keranjang Pesanan
        </p>
        <p className="text-[11px] text-[#a09888] mt-0.5">
          {cart.length === 0
            ? "Belum ada item"
            : `${cart.length} item ditambahkan`}
        </p>
      </div>

      {/* Customer details */}
      <div className="px-5 py-4 border-b border-[#f0ebe2] bg-white space-y-2.5">
        <p className="text-[10px] uppercase tracking-[.6px] font-bold text-[#1c1c18]">
          Detail Pelanggan
        </p>
        <input
          className="w-full h-9 px-3 text-sm border border-[#e2ddd6] rounded-xl outline-none focus:border-[#c45c1a]"
          placeholder="Nama pelanggan"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            className="w-full h-9 px-3 text-sm border border-[#e2ddd6] rounded-xl outline-none"
            type="number"
            placeholder="Jumlah orang"
            value={customerCount}
            onChange={(e) => setCustomerCount(parseInt(e.target.value))}
          />
          <input
            className="w-full h-9 px-3 text-sm border border-[#f0d4c0] rounded-xl outline-none bg-[#fff8f2] text-[#c45c1a] font-bold text-center"
            type="number"
            placeholder="No. Meja"
            value={tableNumber}
            onChange={(e) =>
              setTableNumber(
                e.target.value === "" ? "" : parseInt(e.target.value),
              )
            }
          />
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-[#c8c0b4]">
            <ShoppingCart className="w-5 h-5" />
            <p className="text-xs font-medium">Keranjang kosong</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {cart.map((item: any) => (
              <div
                key={item.cartId}
                className="bg-[#faf8f5] border border-[#ede8e0] rounded-2xl p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#1c1c18]">
                      {item.name}
                    </p>
                    {item.sauceName && (
                      <p className="text-[11px] text-[#c45c1a]">
                        {item.sauceName}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-[#c45c1a]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {item.unit === "KG" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      className="w-16 h-7 border rounded text-center"
                      value={item.weight}
                      onChange={(e) =>
                        updateWeight(item.cartId, parseFloat(e.target.value))
                      }
                    />
                    <span className="ml-auto text-xs font-bold">
                      Rp {itemSubtotal(item).toLocaleString("id-ID")}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.cartId, -1)}>
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.cartId, 1)}>
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="ml-auto text-xs font-bold">
                      Rp {itemSubtotal(item).toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#f0ebe2]">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm font-medium">Total Tagihan</span>
          <span className="text-[22px] font-bold text-[#1c1c18]">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>
        <button
          className="w-full h-12 rounded-2xl bg-[#2d7a3a] text-white font-bold disabled:bg-gray-300"
          disabled={cart.length === 0 || loading}
          onClick={handleProcessOrder}
        >
          {loading ? "Menyimpan..." : "Proses & Cetak Nota"}
        </button>
      </div>
    </div>
  );
}
