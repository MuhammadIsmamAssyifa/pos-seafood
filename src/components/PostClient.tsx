"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { createOrder } from "@/app/actions/order";
import { useRouter } from "next/navigation";

export default function PosClient({
  products,
  sauces,
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

  const router = useRouter();

  const handleAddClick = (product: any) => {
    if (product.unit === "KG") {
      setSelectedProduct(product);
      setIsSausModalOpen(true);
    } else {
      addToCart(product, null);
    }
  };

  const addToCart = (product: any, sauceId: number | null) => {
    const sauceName = sauces.find((s) => s.id === sauceId)?.name;

    setCart((prev) => {
      const cartId = `${product.id}-${sauceId}`;
      const existing = prev.find((item) => item.id === product.id);
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
          cartId,
          sauceId,
          sauceName,
          quantity: 1,
          weight: product.unit === "KG" ? 1 : null,
        },
      ];
    });
    setIsSausModalOpen(false);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => {
    const price = Number(item.basePrice);
    return (
      sum +
      (item.unit === "KG" ? price * (item.weight || 0) : price * item.quantity)
    );
  }, 0);

  const handleProcessOrder = async () => {
    if (!customerName || !tableNumber) {
      alert("Nama Pelanggan dan Nomor Papan wajib diisi!");
      return;
    }

    setLoading(true);

    const itemsToSubmit = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      weight: item.unit === "KG" ? item.weight : null,
      sauceId: undefined,
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
    <div className="flex h-screen bg-slate-50">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-all">
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-md">{product.name}</CardTitle>
                  <Badge
                    variant={product.unit === "KG" ? "destructive" : "default"}
                  >
                    {product.unit}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xl font-bold">
                  Rp {Number(product.basePrice).toLocaleString("id-ID")}
                </p>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Button
                  onClick={() => handleAddClick(product)}
                  className="w-full"
                >
                  Tambah
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isSausModalOpen} onOpenChange={setIsSausModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pilih Saus untuk {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {sauces.map((sauce) => (
              <Button
                key={sauce.id}
                variant="outline"
                className="h-16 text-md font-semibold hover:bg-orange-50 hover:border-orange-500"
                onClick={() => addToCart(selectedProduct, sauce.id)}
              >
                {sauce.name}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-96 bg-white border-l shadow-2xl p-6 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-6 border-b pb-2">
          Keranjang Pesanan
        </h2>

        <div className="space-y-3 mb-6 bg-slate-100 p-4 rounded-xl">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">
              Detail Pelanggan
            </label>
            <input
              className="w-full p-2 mt-1 border rounded-md"
              placeholder="Nama Pelanggan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                className="w-full p-2 border rounded-md"
                type="number"
                placeholder="Jumlah Orang"
                value={customerCount}
                onChange={(e) => setCustomerCount(parseInt(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <input
                className="w-full p-2 border rounded-md bg-yellow-50 border-yellow-200 font-bold"
                type="number"
                placeholder="No. Papan"
                value={tableNumber}
                onChange={(e) =>
                  setTableNumber(
                    e.target.value === "" ? "" : parseInt(e.target.value),
                  )
                }
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              Keranjang Kosong
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-lg border">
                <div className="flex justify-between font-bold mb-2">
                  <span>
                    {item.name} {item.sauceName && `(${item.sauceName})`}
                  </span>
                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* LOGIKA INPUT BERAT VS QUANTITY */}
                {item.unit === "KG" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Berat (kg):</span>
                    <input
                      type="number"
                      step="0.1"
                      className="w-20 p-1 border rounded text-center"
                      value={item.weight}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCart(
                          cart.map((i) =>
                            i.id === item.id ? { ...i, weight: val } : i,
                          ),
                        );
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCart(
                          cart.map((i) =>
                            i.id === item.id && i.quantity > 1
                              ? { ...i, quantity: i.quantity - 1 }
                              : i,
                          ),
                        );
                      }}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span>{item.quantity} porsi</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCart(
                          cart.map((i) =>
                            i.id === item.id
                              ? { ...i, quantity: i.quantity + 1 }
                              : i,
                          ),
                        );
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-black mb-4">
            <span>Total Tagihan</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
          <Button
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700"
            disabled={cart.length === 0 || loading}
            onClick={handleProcessOrder}
          >
            {loading ? "Menyimpan..." : "PROSES & CETAK"}
          </Button>
        </div>
      </div>
    </div>
  );
}
