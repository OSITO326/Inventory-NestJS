-- DropForeignKey
ALTER TABLE "categories_on_products" DROP CONSTRAINT "categories_on_products_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_trademarksId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "trademarksId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_trademarksId_fkey" FOREIGN KEY ("trademarksId") REFERENCES "trademarks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_on_products" ADD CONSTRAINT "categories_on_products_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
