"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- ACTIONS UNTUK CATEGORY ---

export async function createCategory(formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.category.create({
        data: { name },
    });
    revalidatePath("/pengaturan");
}

export async function updateCategory(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.category.update({
        where: { id },
        data: { name },
    });
    revalidatePath("/pengaturan");
}

export async function deleteCategory(id: number) {
    // Proteksi: Cek apakah ada produk yang pakai kategori ini
    const productCount = await prisma.product.count({
        where: { categoryId: id },
    });

    if (productCount > 0) {
        throw new Error("Kategori tidak bisa dihapus karena masih digunakan oleh produk.");
    }

    await prisma.category.delete({
        where: { id },
    });
    revalidatePath("/pengaturan");
}

// --- ACTIONS UNTUK SAUCE ---

export async function createSauce(formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.sauce.create({
        data: { name },
    });
    revalidatePath("/pengaturan");
}

export async function updateSauce(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    await prisma.sauce.update({
        where: { id },
        data: { name },
    });
    revalidatePath("/pengaturan");
}

export async function deleteSauce(id: number) {
    // Proteksi: Cek apakah ada produk yang terhubung ke saus ini
    const usageCount = await prisma.productSauce.count({
        where: { sauceId: id },
    });

    if (usageCount > 0) {
        throw new Error("Saus tidak bisa dihapus karena masih terhubung ke beberapa menu.");
    }

    await prisma.sauce.delete({
        where: { id },
    });
    revalidatePath("/pengaturan");
}