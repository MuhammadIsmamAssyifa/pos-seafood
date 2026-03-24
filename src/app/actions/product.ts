"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as "PCS" | "KG";
    const categoryId = Number(formData.get("categoryId")) as number;
    const imageUrl = formData.get("imageUrl") as string;

    await prisma.product.create({
        data: {
            name,
            basePrice: parseFloat(price),
            unit,
            categoryId,
            imageUrl,
        },
    });

    revalidatePath("/daftar-menu");
    redirect("/daftar-menu");
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });

    revalidatePath("/daftar-menu");
}