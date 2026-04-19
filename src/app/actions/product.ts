"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const sellingPrice = parseFloat(formData.get("sellingPrice") as string);
    const unit = formData.get("unit") as "PCS" | "KG";
    const categoryId = Number(formData.get("categoryId")) as number;
    const imageUrl = formData.get("imageUrl") as string;
    const isAvailable = formData.get("isAvailable") === "true";
    const selectedSauceIds = formData.getAll("sauceIds").map(id => parseInt(id as string));
    const sauceData = selectedSauceIds.map(sId => {
        const extraPrice = formData.get(`extraPrice_${sId}`) as string;
        return {
            sauceId: sId,
            extraPrice: parseFloat(extraPrice || "0")
        };
    });

    await prisma.product.create({
        data: {
            name,
            basePrice: basePrice,
            sellingPrice: sellingPrice,
            unit,
            categoryId,
            isAvailable,
            imageUrl,
            allowedSauces: {
                create: sauceData
            }
        },
    });

    revalidatePath("/daftar-menu");
    redirect("/daftar-menu");
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const sellingPrice = parseFloat(formData.get("sellingPrice") as string);
    const unit = formData.get("unit") as "PCS" | "KG";
    const categoryId = Number(formData.get("categoryId"));
    const imageUrl = formData.get("imageUrl") as string;
    const selectedSauceIds = formData
        .getAll("sauceIds")
        .map(id => parseInt(id as string));
    const sauceData = selectedSauceIds.map(sId => {
        const extraPrice = formData.get(`extraPrice_${sId}`) as string;
        return {
            sauceId: sId,
            extraPrice: parseFloat(extraPrice || "0")
        };
    });
    const isAvailable = formData.get("isAvailable") === "true";

    await prisma.$transaction([
        prisma.productSauce.deleteMany({
            where: { productId: id },
        }),
        prisma.product.update({
            where: { id },
            data: {
                name,
                basePrice: basePrice,
                sellingPrice: sellingPrice,
                unit,
                categoryId,
                isAvailable,
                imageUrl,
                allowedSauces: {
                    create: sauceData
                }
            },
        }),
    ]);

    revalidatePath("/daftar-menu");
    redirect("/daftar-menu");
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    });
    revalidatePath("/daftar-menu");
}