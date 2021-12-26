BEGIN;
ALTER TABLE "public"."PaintsInPalette" DROP CONSTRAINT "PaintsInPalette_paletteId_fkey";
ALTER TABLE "public"."PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "public"."Palette" (id) ON UPDATE NO ACTION ON DELETE CASCADE;
COMMIT;
