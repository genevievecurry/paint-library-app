/*
  Warnings:

  - You are about to drop the column `uuid` on the `Pigment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Pigment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Pigment_uuid_key";

-- AlterTable
ALTER TABLE "Pigment" DROP COLUMN "uuid";

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_slug_key" ON "Pigment"("slug");
