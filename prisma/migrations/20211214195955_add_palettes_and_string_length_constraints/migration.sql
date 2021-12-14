/*
  Warnings:

  - You are about to alter the column `content` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the column `productColorName` on the `Paint` table. All the data in the column will be lost.
  - You are about to alter the column `productUrl` on the `Paint` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(140)`.
  - You are about to alter the column `communityDescription` on the `Paint` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(240)`.
  - You are about to alter the column `manufacturerDescription` on the `Paint` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(240)`.
  - You are about to alter the column `manufacturerPigmentDescription` on the `Paint` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(240)`.
  - You are about to alter the column `hex` on the `Paint` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `description` on the `Paper` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(240)`.
  - You are about to alter the column `name` on the `Pigment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `number` on the `Pigment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(4)`.
  - You are about to alter the column `hex` on the `Pigment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `label` on the `SwatchCardType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `description` on the `SwatchCardType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(240)`.
  - You are about to alter the column `label` on the `Tag` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - You are about to alter the column `hashedPassword` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `displayName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(60)`.
  - A unique constraint covering the columns `[manufacturerId,name]` on the table `Paint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Paint` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Paint_manufacturerId_productColorName_key";

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "content" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Paint" DROP COLUMN "productColorName",
ADD COLUMN     "name" VARCHAR(140) NOT NULL,
ALTER COLUMN "productUrl" SET DATA TYPE VARCHAR(140),
ALTER COLUMN "communityDescription" SET DATA TYPE VARCHAR(240),
ALTER COLUMN "manufacturerDescription" SET DATA TYPE VARCHAR(240),
ALTER COLUMN "manufacturerPigmentDescription" SET DATA TYPE VARCHAR(240),
ALTER COLUMN "hex" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "Paper" ALTER COLUMN "description" SET DATA TYPE VARCHAR(240);

-- AlterTable
ALTER TABLE "Pigment" ALTER COLUMN "name" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "number" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "hex" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "SwatchCardType" ALTER COLUMN "label" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(240);

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "label" SET DATA TYPE VARCHAR(60);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hashedPassword" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "displayName" SET DATA TYPE VARCHAR(60);

-- CreateTable
CREATE TABLE "Palette" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(240),
    "ownerId" INTEGER NOT NULL,
    "savedById" INTEGER,

    CONSTRAINT "Palette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintsInPalette" (
    "id" SERIAL NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER,
    "paletteId" INTEGER NOT NULL,
    "paintId" INTEGER NOT NULL,

    CONSTRAINT "PaintsInPalette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_savedPalettes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Palette_slug_key" ON "Palette"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_savedPalettes_AB_unique" ON "_savedPalettes"("A", "B");

-- CreateIndex
CREATE INDEX "_savedPalettes_B_index" ON "_savedPalettes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Paint_manufacturerId_name_key" ON "Paint"("manufacturerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_savedById_fkey" FOREIGN KEY ("savedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedPalettes" ADD FOREIGN KEY ("A") REFERENCES "Palette"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedPalettes" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
