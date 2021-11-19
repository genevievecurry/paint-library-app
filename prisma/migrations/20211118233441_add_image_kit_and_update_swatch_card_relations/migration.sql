/*
  Warnings:

  - You are about to drop the column `swatchCardTypeId` on the `SwatchCard` table. All the data in the column will be lost.
  - You are about to drop the column `swatchId` on the `SwatchCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `SwatchCardType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `SwatchCardType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SwatchCardTypeName" AS ENUM ('GRADIENT', 'GRANULATION', 'DISPERSEMENT', 'HIGH_DILUTION', 'MID_DILUTION', 'MASSTONE', 'GLAZE', 'WET_LIFT', 'DRY_LIFT');

-- DropForeignKey
ALTER TABLE "SwatchCard" DROP CONSTRAINT "SwatchCard_swatchCardTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SwatchCard" DROP CONSTRAINT "SwatchCard_swatchId_fkey";

-- AlterTable
ALTER TABLE "Pigment" ADD COLUMN     "imageKitUploadId" INTEGER;

-- AlterTable
ALTER TABLE "SwatchCard" DROP COLUMN "swatchCardTypeId",
DROP COLUMN "swatchId",
ADD COLUMN     "imageKitUploadId" INTEGER,
ADD COLUMN     "swatchCardTypeName" "SwatchCardTypeName";

-- AlterTable
ALTER TABLE "SwatchCardType" ADD COLUMN     "name" "SwatchCardTypeName" NOT NULL;

-- CreateTable
CREATE TABLE "SwatchCardsOnSwatch" (
    "id" SERIAL NOT NULL,
    "swatchId" INTEGER NOT NULL,
    "gradientId" INTEGER,
    "granulationId" INTEGER,
    "dispersementId" INTEGER,
    "highDilutionId" INTEGER,
    "midDilutionId" INTEGER,
    "masstoneId" INTEGER,
    "glazeId" INTEGER,
    "wetLiftId" INTEGER,
    "dryLiftId" INTEGER,

    CONSTRAINT "SwatchCardsOnSwatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageKitUpload" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageKitUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SwatchCardsOnSwatch_swatchId_key" ON "SwatchCardsOnSwatch"("swatchId");

-- CreateIndex
CREATE UNIQUE INDEX "SwatchCardType_name_key" ON "SwatchCardType"("name");

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_imageKitUploadId_fkey" FOREIGN KEY ("imageKitUploadId") REFERENCES "ImageKitUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_swatchCardTypeName_fkey" FOREIGN KEY ("swatchCardTypeName") REFERENCES "SwatchCardType"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_imageKitUploadId_fkey" FOREIGN KEY ("imageKitUploadId") REFERENCES "ImageKitUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_gradientId_fkey" FOREIGN KEY ("gradientId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_granulationId_fkey" FOREIGN KEY ("granulationId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_dispersementId_fkey" FOREIGN KEY ("dispersementId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_highDilutionId_fkey" FOREIGN KEY ("highDilutionId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_midDilutionId_fkey" FOREIGN KEY ("midDilutionId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_masstoneId_fkey" FOREIGN KEY ("masstoneId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_glazeId_fkey" FOREIGN KEY ("glazeId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_wetLiftId_fkey" FOREIGN KEY ("wetLiftId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnSwatch" ADD CONSTRAINT "SwatchCardsOnSwatch_dryLiftId_fkey" FOREIGN KEY ("dryLiftId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
