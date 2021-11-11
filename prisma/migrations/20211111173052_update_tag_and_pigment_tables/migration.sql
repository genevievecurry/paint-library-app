/*
  Warnings:

  - You are about to drop the column `swatchId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the `PigmentOnSwatch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PigmentOnSwatch" DROP CONSTRAINT "PigmentOnSwatch_pigmentId_fkey";

-- DropForeignKey
ALTER TABLE "PigmentOnSwatch" DROP CONSTRAINT "PigmentOnSwatch_swatchId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_swatchId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "swatchId";

-- DropTable
DROP TABLE "PigmentOnSwatch";

-- CreateTable
CREATE TABLE "PigmentsOnSwatches" (
    "id" SERIAL NOT NULL,
    "swatchId" INTEGER NOT NULL,
    "pigmentId" INTEGER NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PigmentsOnSwatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnSwatches" (
    "id" SERIAL NOT NULL,
    "swatchId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnSwatches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PigmentsOnSwatches" ADD CONSTRAINT "PigmentsOnSwatches_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentsOnSwatches" ADD CONSTRAINT "PigmentsOnSwatches_pigmentId_fkey" FOREIGN KEY ("pigmentId") REFERENCES "Pigment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnSwatches" ADD CONSTRAINT "TagsOnSwatches_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnSwatches" ADD CONSTRAINT "TagsOnSwatches_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
