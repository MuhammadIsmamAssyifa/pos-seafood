import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Utensils } from "lucide-react";
import PosClient from "@/components/PostClient";

export default async function PosPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });
  const sauces = await prisma.sauce.findMany({ orderBy: { name: "asc" } });

  const safeProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
  }));

  return <PosClient products={safeProducts} sauces={sauces} />;
}
