import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma"; 

const connectionString = `${process.env.DATABASE_URL}`;

// Inisialisasi Driver Postgres
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool as any);

// Inisialisasi Prisma dengan Adapter
const prisma = new PrismaClient({ adapter });

// const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "Category", "Product", "Sauce", "ProductSauce" RESTART IDENTITY CASCADE`,
  );

  const catSeafood = await prisma.category.create({
    data: { name: "Seafood" },
  });
  const catDrink = await prisma.category.create({ data: { name: "Minuman" } });

  const sausPadang = await prisma.sauce.create({
    data: { name: "Saus Padang" },
  });
  const sausTiram = await prisma.sauce.create({ data: { name: "Saus Tiram" } });
  const asamManis = await prisma.sauce.create({ data: { name: "Asam Manis" } });
  const masakHitam = await prisma.sauce.create({
    data: { name: "Masak Hitam" },
  });

  const kepiting = await prisma.product.create({
    data: {
      name: "Kepiting Jantan",
      categoryId: catSeafood.id,
      basePrice: 250000,
      unit: "KG",
      allowedSauces: {
        create: [
          { sauceId: sausPadang.id },
          { sauceId: sausTiram.id },
          { sauceId: asamManis.id },
        ],
      },
    },
  });

  const cumi = await prisma.product.create({
    data: {
      name: "Cumi-cumi Fresh",
      categoryId: catSeafood.id,
      basePrice: 120000,
      unit: "KG",
      allowedSauces: {
        create: [{ sauceId: sausPadang.id }, { sauceId: masakHitam.id }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Es Jeruk Peras",
      categoryId: catDrink.id,
      basePrice: 15000,
      unit: "PCS",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
