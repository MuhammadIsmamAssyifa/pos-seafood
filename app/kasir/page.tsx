import { prisma } from "@/lib/prisma";
import PosClient from "@/components/PostClient";

export default async function KasirPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      allowedSauces: {
        include: {
          sauce: true,
        },
      },
    },
  });
  const sauces = await prisma.sauce.findMany({ orderBy: { name: "asc" } });

  const safeProducts = products.map((p) => ({
    ...p,
    basePrice: p.basePrice.toNumber(),
    sellingPrice: p.sellingPrice.toNumber(),
  }));

  return <PosClient products={safeProducts} sauces={sauces} />;
}
