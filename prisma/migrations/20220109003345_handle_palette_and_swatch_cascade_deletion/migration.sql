-- Cascade on swatch card deletion
BEGIN;
ALTER TABLE "public"."SwatchCardTypesOnSwatchCard" DROP CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey";
ALTER TABLE "public"."SwatchCardTypesOnSwatchCard" ADD CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey" FOREIGN KEY ("swatchCardId") REFERENCES "public"."SwatchCard" (id) ON UPDATE NO ACTION ON DELETE CASCADE;
COMMIT;

-- Cascade on palette deletion
BEGIN;
ALTER TABLE "public"."PaintsInPalette" DROP CONSTRAINT "PaintsInPalette_paletteUuid_fkey";
ALTER TABLE "public"."PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "public"."Palette" (uuid) ON UPDATE NO ACTION ON DELETE CASCADE;
COMMIT;
