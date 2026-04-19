"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, ItemStatus, Prisma, PaymentMethod } from "../../../generated/prisma";
import { revalidatePath } from "next/cache";

interface OrderItemInput {
    productId: string;
    productName: string;
    sauceId?: number;
    sauceName?: string | null;
    quantity: number;
    weight?: number;
    customerName?: string;
    priceAtTime: number;
}

export async function createOrder(
    userId: string,
    tableNumber: number,
    customerName: string,
    customerCount: number,
    items: OrderItemInput[]
) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Cek Meja Aktif
            const existingOrder = await tx.order.findFirst({
                where: {
                    tableNumber: tableNumber,
                    status: OrderStatus.OPEN,
                },
            });

            if (existingOrder) {
                throw new Error(`Meja nomor ${tableNumber} masih digunakan oleh ${existingOrder.customerName}!`);
            }

            // 2. Buat Order Baru
            const order = await tx.order.create({
                data: {
                    tableNumber,
                    customerName,
                    customerCount,
                    userId,
                    status: OrderStatus.OPEN,
                },
            });

            // 3. Buat Items dengan Snapshot
            for (const item of items) {
                // Kalkulasi subtotal (priceAtTime sudah termasuk extra saus dari frontend)
                const subtotal = item.weight
                    ? Number(item.priceAtTime) * item.weight
                    : Number(item.priceAtTime) * item.quantity;

                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        productName: item.productName, // SNAPSHOT NAMA
                        sauceId: item.sauceId || null,
                        sauceName: item.sauceName || null, // SNAPSHOT SAUS
                        quantity: item.quantity,
                        weight: item.weight || null,
                        priceAtTime: item.priceAtTime,
                        subtotal: subtotal,
                        status: ItemStatus.PENDING,
                    },
                });
            }

            return order;
        });

        revalidatePath("/kitchen"); // Agar monitor dapur update
        return { success: true, orderId: result.id };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addItemToOrder(
    tableNumber: number,
    userId: string,
    items: OrderItemInput[],
    customerName?: string,
    customerCount?: number,
) {
    try {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            let order = await tx.order.findFirst({
                where: {
                    tableNumber: tableNumber,
                    status: OrderStatus.OPEN,
                },
            });

            if (!order && !customerName) {
                throw new Error("Meja ini belum ada pesanan aktif. Mohon input Nama Pelanggan.");
            }

            if (!order) {
                order = await tx.order.create({
                    data: {
                        tableNumber,
                        userId,
                        customerName: customerName || "Tamu",
                        customerCount: customerCount || 0,
                        status: OrderStatus.OPEN
                    },
                });
            }

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error(`Produk ${item.productId} tidak ditemukan!`);

                const price = Number(product.basePrice);
                const subtotal = product.unit === "KG"
                    ? price * (item.weight || 0)
                    : price * item.quantity;

                await tx.orderItem.create({
                    data: {
                        orderId: order!.id,
                        productId: item.productId,
                        productName: item.productName,
                        sauceId: item.sauceId || null,
                        sauceName: item.sauceName || null,
                        quantity: item.quantity,
                        weight: item.weight || null,
                        priceAtTime: product.basePrice,
                        subtotal: subtotal,
                        status: ItemStatus.PENDING,
                    },
                });
            }

            return { success: true, orderId: order!.id };
        });
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function payItems(orderId: string, itemIds: string[], paymentMethod: "CASH" | "QRIS" | "DEBIT") {
    try {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const itemsToPay = await tx.orderItem.findMany({
                where: {
                    id: { in: itemIds },
                    orderId: orderId,
                    isPaid: false,
                },
            });

            if (itemsToPay.length === 0) throw new Error("Tidak ada item valid untuk dibayar");

            const totalAmount = itemsToPay.reduce((sum, item) => sum + Number(item.subtotal), 0);

            await tx.orderItem.updateMany({
                where: { id: { in: itemIds } },
                data: { isPaid: true },
            });

            await tx.payment.create({
                data: {
                    orderId: orderId,
                    amountPaid: totalAmount,
                    method: paymentMethod,
                },
            });

            const remainingItems = await tx.orderItem.count({
                where: { orderId: orderId, isPaid: false },
            });

            if (remainingItems === 0) {
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: OrderStatus.PAID },
                });
            }

            return { success: true, amountPaid: totalAmount, orderClosed: remainingItems === 0 };
        });
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function cancelItem(orderItemId: string) {
    try {
        await prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                status: ItemStatus.SERVED,
                subtotal: 0,
                quantity: 0,
            },
        });
        revalidatePath("/kasir");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function completeCooking(orderId: string) {
    try {
        await prisma.orderItem.updateMany({
            where: {
                orderId: orderId,
                status: {
                    in: ["PENDING", "COOKING"]
                }
            },
            data: {
                status: "SERVED",
            }
        });

        revalidatePath("/kitchen");
        revalidatePath("/kasir");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Gagal memperbarui status" };
    }
}

export async function processPayment(
    orderId: string,
    method: PaymentMethod,
    amountPaid: number
) {
    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Catat Pembayaran
            await tx.payment.create({
                data: {
                    orderId,
                    method,
                    amountPaid,
                },
            });

            // 2. Tandai semua item di order ini sebagai "Sudah Dibayar"
            await tx.orderItem.updateMany({
                where: { orderId },
                data: { isPaid: true },
            });

            // 3. Ubah status Order menjadi PAID (Lunas)
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.PAID },
            });

            revalidatePath("/kasir");
            revalidatePath("/laporan");
            return { success: true, order: updatedOrder };
        });
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}