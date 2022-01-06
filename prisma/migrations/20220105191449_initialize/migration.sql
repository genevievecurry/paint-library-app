CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "PigmentType" AS ENUM ('HISTORIC', 'CINATURAL', 'CIPIGMENT');

-- CreateEnum
CREATE TYPE "SwatchCardTypeName" AS ENUM ('GRADIENT', 'GRANULATION', 'DISPERSEMENT', 'HIGH_DILUTION', 'MID_DILUTION', 'MASSTONE', 'GLAZE', 'WET_LIFT', 'DRY_LIFT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "email" CITEXT NOT NULL,
    "hashedPassword" VARCHAR(100) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100),
    "username" CITEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MEMBER',
    "status" "UserStatus" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,

    CONSTRAINT "UserToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paint" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorUuid" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "manufacturerId" INTEGER,
    "paintTypeId" INTEGER NOT NULL,
    "lineId" INTEGER,
    "productUrl" VARCHAR(140),
    "name" VARCHAR(140) NOT NULL,
    "communityDescription" VARCHAR(500),
    "manufacturerDescription" VARCHAR(500),
    "hex" VARCHAR(10),
    "lightfastRatingId" INTEGER NOT NULL,
    "transparencyRatingId" INTEGER NOT NULL,
    "stainingRatingId" INTEGER NOT NULL,
    "granulationRatingId" INTEGER NOT NULL,

    CONSTRAINT "Paint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pigment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "slug" TEXT NOT NULL,
    "type" "PigmentType" NOT NULL DEFAULT E'CIPIGMENT',
    "name" VARCHAR(60) NOT NULL,
    "number" VARCHAR(4) NOT NULL,
    "hex" VARCHAR(10),
    "colorCode" TEXT NOT NULL,
    "imageKitUploadId" INTEGER,
    "lightfastRatingId" INTEGER,
    "transparencyRatingId" INTEGER,

    CONSTRAINT "Pigment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PigmentsOnPaints" (
    "id" SERIAL NOT NULL,
    "paintId" INTEGER NOT NULL,
    "pigmentId" INTEGER NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PigmentsOnPaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" VARCHAR(60) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnPaints" (
    "id" SERIAL NOT NULL,
    "paintId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnPaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnSwatchCards" (
    "id" SERIAL NOT NULL,
    "swatchCardId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagsOnSwatchCards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwatchCard" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "paperId" INTEGER,
    "authorUuid" TEXT,
    "description" TEXT,
    "imageKitUploadId" INTEGER,
    "paintId" INTEGER NOT NULL,

    CONSTRAINT "SwatchCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwatchCardType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" "SwatchCardTypeName" NOT NULL,
    "label" VARCHAR(60) NOT NULL,
    "description" VARCHAR(240) NOT NULL,

    CONSTRAINT "SwatchCardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwatchCardTypesOnSwatchCard" (
    "id" SERIAL NOT NULL,
    "swatchCardId" INTEGER NOT NULL,
    "swatchCardTypeName" "SwatchCardTypeName",

    CONSTRAINT "SwatchCardTypesOnSwatchCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "manufacturerId" INTEGER,
    "lineId" INTEGER,
    "weightInLbs" INTEGER NOT NULL,
    "paperTypeId" INTEGER NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaperType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,

    CONSTRAINT "PaperType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "authorUuid" TEXT NOT NULL,
    "paintId" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "content" VARCHAR(500) NOT NULL,
    "noteId" INTEGER,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "manufacturerName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "PaintType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LightfastRating" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "LightfastRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransparencyRating" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TransparencyRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StainingRating" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "StainingRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GranulationRating" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "GranulationRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageKitUpload" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "fileId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "height" INTEGER,
    "width" INTEGER,

    CONSTRAINT "ImageKitUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Palette" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(240),
    "ownerUuid" TEXT NOT NULL,

    CONSTRAINT "Palette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintsInPalette" (
    "id" SERIAL NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER,
    "paletteUuid" TEXT NOT NULL,
    "paintUuid" TEXT NOT NULL,

    CONSTRAINT "PaintsInPalette_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaletteSavedByUsers" (
    "id" SERIAL NOT NULL,
    "setAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paletteUuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,

    CONSTRAINT "PaletteSavedByUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Paint_uuid_key" ON "Paint"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Paint_manufacturerId_name_key" ON "Paint"("manufacturerId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_slug_key" ON "Pigment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_type_colorCode_number_key" ON "Pigment"("type", "colorCode", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_label_slug_key" ON "Tag"("label", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "SwatchCardType_name_key" ON "SwatchCardType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Line_manufacturerName_name_key" ON "Line"("manufacturerName", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PaintType_label_key" ON "PaintType"("label");

-- CreateIndex
CREATE UNIQUE INDEX "PaintType_slug_key" ON "PaintType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Color_label_key" ON "Color"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Color_slug_key" ON "Color"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Color_code_key" ON "Color"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Palette_uuid_key" ON "Palette"("uuid");

-- AddForeignKey
ALTER TABLE "UserToken" ADD CONSTRAINT "UserToken_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_paintTypeId_fkey" FOREIGN KEY ("paintTypeId") REFERENCES "PaintType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_lightfastRatingId_fkey" FOREIGN KEY ("lightfastRatingId") REFERENCES "LightfastRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_transparencyRatingId_fkey" FOREIGN KEY ("transparencyRatingId") REFERENCES "TransparencyRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_stainingRatingId_fkey" FOREIGN KEY ("stainingRatingId") REFERENCES "StainingRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_granulationRatingId_fkey" FOREIGN KEY ("granulationRatingId") REFERENCES "GranulationRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_colorCode_fkey" FOREIGN KEY ("colorCode") REFERENCES "Color"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_imageKitUploadId_fkey" FOREIGN KEY ("imageKitUploadId") REFERENCES "ImageKitUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_lightfastRatingId_fkey" FOREIGN KEY ("lightfastRatingId") REFERENCES "LightfastRating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_transparencyRatingId_fkey" FOREIGN KEY ("transparencyRatingId") REFERENCES "TransparencyRating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentsOnPaints" ADD CONSTRAINT "PigmentsOnPaints_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentsOnPaints" ADD CONSTRAINT "PigmentsOnPaints_pigmentId_fkey" FOREIGN KEY ("pigmentId") REFERENCES "Pigment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPaints" ADD CONSTRAINT "TagsOnPaints_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPaints" ADD CONSTRAINT "TagsOnPaints_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnSwatchCards" ADD CONSTRAINT "TagsOnSwatchCards_swatchCardId_fkey" FOREIGN KEY ("swatchCardId") REFERENCES "SwatchCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnSwatchCards" ADD CONSTRAINT "TagsOnSwatchCards_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_imageKitUploadId_fkey" FOREIGN KEY ("imageKitUploadId") REFERENCES "ImageKitUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardTypesOnSwatchCard" ADD CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardId_fkey" FOREIGN KEY ("swatchCardId") REFERENCES "SwatchCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardTypesOnSwatchCard" ADD CONSTRAINT "SwatchCardTypesOnSwatchCard_swatchCardTypeName_fkey" FOREIGN KEY ("swatchCardTypeName") REFERENCES "SwatchCardType"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_paperTypeId_fkey" FOREIGN KEY ("paperTypeId") REFERENCES "PaperType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorUuid_fkey" FOREIGN KEY ("authorUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_manufacturerName_fkey" FOREIGN KEY ("manufacturerName") REFERENCES "Manufacturer"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "Palette"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintsInPalette" ADD CONSTRAINT "PaintsInPalette_paintUuid_fkey" FOREIGN KEY ("paintUuid") REFERENCES "Paint"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaletteSavedByUsers" ADD CONSTRAINT "PaletteSavedByUsers_paletteUuid_fkey" FOREIGN KEY ("paletteUuid") REFERENCES "Palette"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaletteSavedByUsers" ADD CONSTRAINT "PaletteSavedByUsers_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
