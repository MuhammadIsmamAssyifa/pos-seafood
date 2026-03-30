-- DropForeignKey
ALTER TABLE "ProductSauce" DROP CONSTRAINT "ProductSauce_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSauce" DROP CONSTRAINT "ProductSauce_sauceId_fkey";

-- AddForeignKey
ALTER TABLE "ProductSauce" ADD CONSTRAINT "ProductSauce_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSauce" ADD CONSTRAINT "ProductSauce_sauceId_fkey" FOREIGN KEY ("sauceId") REFERENCES "Sauce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
