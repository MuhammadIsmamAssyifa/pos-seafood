/*
  Warnings:

  - Added the required column `sellingPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sellingPrice" DECIMAL(12,2) NOT NULL;
