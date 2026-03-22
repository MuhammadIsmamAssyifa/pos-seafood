"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, ItemStatus, Prisma } from "../../../generated/prisma";

interface OrderItemInput {
    productId: string;
    sauceId?: number;
    quantity: number;
    weight?: number;
    customerName?: string;
}

export async function createOrder(
    userId: string,
    tableNumber: number,
    customerName: string,
    customerCount: number,
    items: OrderItemInput[]
) {
    try {
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const existingOrder = await tx.order.findFirst({
                where: {
                    tableNumber: tableNumber,
                    status: OrderStatus.OPEN,
                },
            });

            if (existingOrder) {
                throw new Error(`Papan nomor ${tableNumber} masih digunakan oleh ${existingOrder.customerName}!`);
            }

            const order = await tx.order.create({
                data: {
                    tableNumber,
                    customerName,
                    customerCount,
                    userId,
                    status: OrderStatus.OPEN,
                },
            });

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error("Produk tidak ditemukan");

                const price = Number(product.basePrice);
                const subtotal = product.unit === "KG"
                    ? price * (item.weight || 0)
                    : price * item.quantity;

                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        sauceId: item.sauceId || null,
                        quantity: item.quantity,
                        weight: item.weight || null,
                        priceAtTime: product.basePrice,
                        subtotal: subtotal,
                    },
                });
            }

            return order;
        });

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
                        sauceId: item.sauceId || null,
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

export async function cancelItem(orderItemId: string, reason: string) {
    try {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const item = await tx.orderItem.findUnique({
                where: { id: orderItemId },
            });

            if (!item) throw new Error("Item tidak ditemukan");
            if (item.isPaid) throw new Error("Item yang sudah dibayar tidak bisa dibatalkan!");

            const updatedItem = await tx.orderItem.update({
                where: { id: orderItemId },
                data: {
                    status: ItemStatus.SERVED,
                    subtotal: 0,
                },
            });

            return { success: true, message: `Berhasil membatalkan pesanan.` };
        });
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

npx shadcn@latest add button card input badge table