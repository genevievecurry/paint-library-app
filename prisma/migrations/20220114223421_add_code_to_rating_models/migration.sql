/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `GranulationRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `LightfastRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `StainingRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `TransparencyRating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `GranulationRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `LightfastRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `StainingRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `TransparencyRating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaintsInPalette" DROP CONSTRAINT "PaintsInPalette_paletteUuid_fkey";

-- AlterTable
ALTER TABLE "GranulationRating" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "LightfastRating" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
CREATE SEQUENCE "paintsinpalette_order_seq";
ALTER TABLE "PaintsInPalette" ALTER COLUMN "order" SET DEFAULT nextval('paintsinpalette_order_seq');
ALTER SEQUENCE "paintsinpalette_order_seq" OWNED BY "PaintsInPalette"."order";

-- AlterTable
ALTER TABLE "StainingRating" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransparencyRating" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GranulationRating_code_key" ON "GranulationRating"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LightfastRating_code_key" ON "LightfastRating"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StainingRating_code_key" ON "StainingRating"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TransparencyRating_code_key" ON "TransparencyRating"("code");

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "Palette"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
