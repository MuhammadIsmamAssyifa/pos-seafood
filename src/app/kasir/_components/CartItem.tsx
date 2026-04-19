// src/app/kasir/_components/CartItem.tsx
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export default function CartItem({ item }: { item: any }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-[#f0ebe2] rounded-xl mb-3 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#1c1c18] leading-tight">
            {item.productName}
          </h4>
          {item.sauceName && (
            <p className="text-[11px] font-medium text-orange-600 mt-0.5">
              [{item.sauceName}]
            </p>
          )}
          <p className="text-[12px] font-semibold text-[#a09888] mt-1">
            Rp {item.priceAtTime.toLocaleString("id-ID")}
            <span className="text-[10px] font-normal ml-1">
              / {item.unit === "KG" ? "kg" : "porsi"}
            </span>
          </p>
        </div>
        <p className="text-sm font-bold text-[#1c1c18]">
          Rp{" "}
          {(item.priceAtTime * (item.weight || item.quantity)).toLocaleString(
            "id-ID",
          )}
        </p>
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#faf8f5]">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-[#e2ddd6]"
            onClick={() =>
              item.quantity > 1 &&
              updateQuantity(item.cartId, item.quantity - 1)
            }
          >
            <Minus className="w-3 h-3" />
          </Button>

          <span className="w-8 text-center text-xs font-bold">
            {item.unit === "KG" ? item.weight : item.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-[#e2ddd6]"
            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
          onClick={() => removeItem(item.cartId)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
