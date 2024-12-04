-- DropForeignKey
ALTER TABLE "categoriesOnProducts" DROP CONSTRAINT "categoriesOnProducts_productsId_fkey";

-- AddForeignKey
ALTER TABLE "categoriesOnProducts" ADD CONSTRAINT "categoriesOnProducts_productsId_fkey" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
