/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Palette` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PaletteSavedByUsers` table. All the data in the column will be lost.
  - Added the required column `ownerUuid` to the `Palette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUuid` to the `PaletteSavedByUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Palette" DROP CONSTRAINT "Palette_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "PaletteSavedByUsers" DROP CONSTRAINT "PaletteSavedByUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Palette" DROP COLUMN "ownerId",
ADD COLUMN     "ownerUuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaletteSavedByUsers" DROP COLUMN "userId",
ADD COLUMN     "userUuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaletteSavedByUsers" ADD CONSTRAINT "PaletteSavedByUsers_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
