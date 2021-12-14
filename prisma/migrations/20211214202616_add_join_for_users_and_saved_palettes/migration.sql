/*
  Warnings:

  - You are about to drop the column `savedById` on the `Palette` table. All the data in the column will be lost.
  - You are about to drop the `_savedPalettes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Palette" DROP CONSTRAINT "Palette_savedById_fkey";

-- DropForeignKey
ALTER TABLE "_savedPalettes" DROP CONSTRAINT "_savedPalettes_A_fkey";

-- DropForeignKey
ALTER TABLE "_savedPalettes" DROP CONSTRAINT "_savedPalettes_B_fkey";

-- AlterTable
ALTER TABLE "Palette" DROP COLUMN "savedById";

-- DropTable
DROP TABLE "_savedPalettes";

-- CreateTable
CREATE TABLE "PaletteSavedByUsers" (
    "id" SERIAL NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paletteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaletteSavedByUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaletteSavedByUsers" ADD CONSTRAINT "PaletteSavedByUsers_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaletteSavedByUsers" ADD CONSTRAINT "PaletteSavedByUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
