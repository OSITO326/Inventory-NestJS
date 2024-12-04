/*
  Warnings:

  - You are about to drop the `categories_on_products` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories_on_products" DROP CONSTRAINT "categories_on_products_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "categories_on_products" DROP CONSTRAINT "categories_on_products_productsId_fkey";

-- DropTable
DROP TABLE "categories_on_products";

-- CreateTable
CREATE TABLE "categoriesOnProducts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productsId" TEXT NOT NULL,
    "categoriesId" TEXT NOT NULL,

    CONSTRAINT "categoriesOnProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientLastname" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderDetails" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productPriceSale" DOUBLE PRECISION NOT NULL,
    "subTotal" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orderDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "categoriesOnProducts" ADD CONSTRAINT "categoriesOnProducts_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoriesOnProducts" ADD CONSTRAINT "categoriesOnProducts_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetails" ADD CONSTRAINT "orderDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
