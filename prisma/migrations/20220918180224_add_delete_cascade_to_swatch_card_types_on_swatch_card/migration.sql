-- DropForeignKey
ALTER TABLE "SwatchCardTypesOnSwatchCard" DROP CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey";

-- AddForeignKey
ALTER TABLE "SwatchCardTypesOnSwatchCard" ADD CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey" FOREIGN KEY ("swatchCardId") REFERENCES "SwatchCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
