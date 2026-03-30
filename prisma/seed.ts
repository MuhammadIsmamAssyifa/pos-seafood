import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, Unit } from "../generated/prisma/index.js";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Cleaning database...");
  // Hapus dengan urutan yang benar (child first)
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productSauce.deleteMany();
  await prisma.product.deleteMany();
  await prisma.sauce.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Reset Identity/Sequence ID (Penting untuk PostgreSQL agar ID mulai dari 1 lagi)
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Category", "Product", "Sauce", "ProductSauce" RESTART IDENTITY CASCADE`,
  );

  console.log("👤 Creating Admin User...");
  await prisma.user.create({
    data: {
      id: "cl-admin-123",
      username: "Kasir Utama",
      passwordHash: "password123",
      role: Role.ADMIN,
    },
  });

  console.log("📂 Creating Categories...");
  const catSeafood = await prisma.category.create({ data: { name: "Seafood"} });
  const catSayur = await prisma.category.create({ data: { name: "Sayur"} });
  const catDrink = await prisma.category.create({ data: { name: "Minuman" } });

  console.log("🥣 Creating Sauces...");
  const sPadang = await prisma.sauce.create({ data: { name: "Saus Padang" } });
  const sTiram = await prisma.sauce.create({ data: { name: "Saus Tiram" } });
  const sAsamManis = await prisma.sauce.create({ data: { name: "Asam Manis" } });
  const sMasakHitam = await prisma.sauce.create({ data: { name: "Masak Hitam" } });
  const sTelurAsin = await prisma.sauce.create({ data: { name: "Saus Telur Asin" } });

  console.log("🦀 Creating Products...");

  // 1. Kepiting (Contoh menu dengan extra price di saus tertentu)
  await prisma.product.create({
    data: {
      name: "Kepiting Jantan",
      categoryId: catSeafood.id,
      basePrice: 250000,    // Harga Modal
      sellingPrice: 320000, // Harga Jual
      unit: "KG" as Unit,
      allowedSauces: {
        create: [
          { sauceId: sPadang.id, extraPrice: 0 },
          { sauceId: sTiram.id, extraPrice: 0 },
          { sauceId: sTelurAsin.id, extraPrice: 25000 }, // Saus mahal ada tambahan!
        ],
      },
    },
  });

  // 2. Cumi
  await prisma.product.create({
    data: {
      name: "Cumi-cumi Fresh",
      categoryId: catSeafood.id,
      basePrice: 120000,
      sellingPrice: 165000,
      unit: "KG" as Unit,
      allowedSauces: {
        create: [
          { sauceId: sPadang.id, extraPrice: 10000 },
          { sauceId: sMasakHitam.id, extraPrice: 0 },
          { sauceId: sAsamManis.id, extraPrice: 0 },
        ],
      },
    },
  });

  // 3. Minuman (Tanpa saus sama sekali)
  await prisma.product.create({
    data: {
      name: "Es Jeruk Peras",
      categoryId: catDrink.id,
      basePrice: 5000,
      sellingPrice: 7000,
      unit: "PCS" as Unit,
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });