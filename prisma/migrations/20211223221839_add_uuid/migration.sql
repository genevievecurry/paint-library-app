/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Paint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Palette` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `Pigment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `Paint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Palette` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `Pigment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Paint_slug_key";

-- DropIndex
DROP INDEX "Palette_slug_key";

-- DropIndex
DROP INDEX "Pigment_slug_key";

-- AlterTable
ALTER TABLE "Paint" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Palette" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pigment" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paint_uuid_key" ON "Paint"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Palette_uuid_key" ON "Palette"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_uuid_key" ON "Pigment"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
