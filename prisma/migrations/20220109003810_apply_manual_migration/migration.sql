-- DropForeignKey
ALTER TABLE "PaintsInPalette" DROP CONSTRAINT "PaintsInPalette_paletteUuid_fkey";

-- DropForeignKey
ALTER TABLE "SwatchCardTypesOnSwatchCard" DROP CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey";

-- AddForeignKey
ALTER TABLE "SwatchCardTypesOnSwatchCard" ADD CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey" FOREIGN KEY ("swatchCardId") REFERENCES "SwatchCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "Palette"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
