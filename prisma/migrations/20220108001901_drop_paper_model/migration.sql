/*
  Warnings:

  - You are about to drop the column `paperId` on the `SwatchCard` table. All the data in the column will be lost.
  - You are about to drop the `Paper` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Paper" DROP CONSTRAINT "Paper_lineId_fkey";

-- DropForeignKey
ALTER TABLE "Paper" DROP CONSTRAINT "Paper_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "Paper" DROP CONSTRAINT "Paper_paperTypeId_fkey";

-- DropForeignKey
ALTER TABLE "SwatchCard" DROP CONSTRAINT "SwatchCard_paperId_fkey";

-- AlterTable
ALTER TABLE "SwatchCard" DROP COLUMN "paperId",
ADD COLUMN     "paperLineId" INTEGER,
ADD COLUMN     "paperManufacturerId" INTEGER,
ADD COLUMN     "paperTypeId" INTEGER,
ADD COLUMN     "paperWeightInLbs" INTEGER;

-- DropTable
DROP TABLE "Paper";

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperManufacturerId_fkey" FOREIGN KEY ("paperManufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperLineId_fkey" FOREIGN KEY ("paperLineId") REFERENCES "Line"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperTypeId_fkey" FOREIGN KEY ("paperTypeId") REFERENCES "PaperType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
