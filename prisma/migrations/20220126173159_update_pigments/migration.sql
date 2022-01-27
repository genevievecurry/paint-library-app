/*
  Warnings:

  - The values [HISTORIC] on the enum `PigmentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `lightfastRatingId` on the `Pigment` table. All the data in the column will be lost.
  - You are about to drop the column `transparencyRatingId` on the `Pigment` table. All the data in the column will be lost.
  - The `number` column on the `Pigment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PigmentType_new" AS ENUM ('ETC', 'CINATURAL', 'CIPIGMENT');
ALTER TABLE "Pigment" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Pigment" ALTER COLUMN "type" TYPE "PigmentType_new" USING ("type"::text::"PigmentType_new");
ALTER TYPE "PigmentType" RENAME TO "PigmentType_old";
ALTER TYPE "PigmentType_new" RENAME TO "PigmentType";
DROP TYPE "PigmentType_old";
ALTER TABLE "Pigment" ALTER COLUMN "type" SET DEFAULT 'CIPIGMENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Pigment" DROP CONSTRAINT "Pigment_lightfastRatingId_fkey";

-- DropForeignKey
ALTER TABLE "Pigment" DROP CONSTRAINT "Pigment_transparencyRatingId_fkey";

-- DropIndex
DROP INDEX "Pigment_type_colorCode_number_key";

-- AlterTable
ALTER TABLE "Pigment" DROP COLUMN "lightfastRatingId",
DROP COLUMN "transparencyRatingId",
ADD COLUMN     "alternateNames" TEXT,
ADD COLUMN     "ciConstitutionNumber" TEXT,
ADD COLUMN     "composition" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "lightfastRatingCode" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "toxicity" TEXT,
ADD COLUMN     "transparencyRatingCode" TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
DROP COLUMN "number",
ADD COLUMN     "number" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_lightfastRatingCode_fkey" FOREIGN KEY ("lightfastRatingCode") REFERENCES "LightfastRating"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_transparencyRatingCode_fkey" FOREIGN KEY ("transparencyRatingCode") REFERENCES "TransparencyRating"("code") ON DELETE SET NULL ON UPDATE CASCADE;
