/*
  Warnings:

  - You are about to drop the column `colorId` on the `Pigment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,colorCode,number]` on the table `Pigment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `colorCode` to the `Pigment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pigment" DROP CONSTRAINT "Pigment_colorId_fkey";

-- DropIndex
DROP INDEX "Pigment_type_colorId_number_key";

-- AlterTable
ALTER TABLE "Color" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ImageKitUpload" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Line" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Manufacturer" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Note" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Paint" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PaintType" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Paper" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pigment" DROP COLUMN "colorId",
ADD COLUMN     "colorCode" TEXT NOT NULL,
ADD COLUMN     "hex" TEXT,
ADD COLUMN     "lightfastRatingId" INTEGER,
ADD COLUMN     "transparencyRatingId" INTEGER,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SwatchCard" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SwatchCardType" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_type_colorCode_number_key" ON "Pigment"("type", "colorCode", "number");

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_colorCode_fkey" FOREIGN KEY ("colorCode") REFERENCES "Color"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_lightfastRatingId_fkey" FOREIGN KEY ("lightfastRatingId") REFERENCES "LightfastRating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_transparencyRatingId_fkey" FOREIGN KEY ("transparencyRatingId") REFERENCES "TransparencyRating"("id") ON DELETE SET NULL ON UPDATE CASCADE;
