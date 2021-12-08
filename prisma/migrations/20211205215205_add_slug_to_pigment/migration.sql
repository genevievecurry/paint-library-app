/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Pigment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Pigment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pigment" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_slug_key" ON "Pigment"("slug");
