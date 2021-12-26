/*
  Warnings:

  - You are about to drop the column `paintId` on the `PaintsInPalette` table. All the data in the column will be lost.
  - You are about to drop the column `paletteId` on the `PaintsInPalette` table. All the data in the column will be lost.
  - You are about to drop the column `paletteId` on the `PaletteSavedByUsers` table. All the data in the column will be lost.
  - Added the required column `paintUuid` to the `PaintsInPalette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paletteUuid` to the `PaintsInPalette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paletteUuid` to the `PaletteSavedByUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaintsInPalette" DROP CONSTRAINT "PaintsInPalette_paintId_fkey";

-- DropForeignKey
ALTER TABLE "PaintsInPalette" DROP CONSTRAINT "PaintsInPalette_paletteId_fkey";

-- DropForeignKey
ALTER TABLE "PaletteSavedByUsers" DROP CONSTRAINT "PaletteSavedByUsers_paletteId_fkey";

-- AlterTable
ALTER TABLE "PaintsInPalette" DROP COLUMN "paintId",
DROP COLUMN "paletteId",
ADD COLUMN     "paintUuid" TEXT NOT NULL,
ADD COLUMN     "paletteUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaletteSavedByUsers" DROP COLUMN "paletteId",
ADD COLUMN     "paletteUuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "Palette"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paintUuid_fkey" FOREIGN KEY ("paintUuid") REFERENCES "Paint"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaletteSavedByUsers" ADD CONSTRAINT "PaletteSavedByUsers_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "Palette"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
