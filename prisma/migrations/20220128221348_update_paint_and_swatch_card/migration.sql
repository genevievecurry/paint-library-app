/*
  Warnings:

  - A unique constraint covering the columns `[primaryOnPaintUuid]` on the table `SwatchCard` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Paint" ALTER COLUMN "productUrl" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "communityDescription" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "manufacturerDescription" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "SwatchCard" ADD COLUMN IF NOT EXISTS "isOriginal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "primaryOnPaintUuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SwatchCard_primaryOnPaintUuid_key" ON "SwatchCard"("primaryOnPaintUuid");

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_primaryOnPaintUuid_fkey" FOREIGN KEY ("primaryOnPaintUuid") REFERENCES "Paint"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
