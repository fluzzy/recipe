/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Recipe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Author` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "imageUrl",
ADD COLUMN     "steps" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "thumbnailUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
