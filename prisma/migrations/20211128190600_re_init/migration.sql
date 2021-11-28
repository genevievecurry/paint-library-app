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
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "email" CITEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MEMBER',
    "status" "UserStatus" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paint" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "manufacturerId" INTEGER,
    "lineId" INTEGER,
    "paintTypeId" INTEGER NOT NULL,
    "productUrl" TEXT,
    "productColorName" TEXT NOT NULL,
    "communityDescription" TEXT,
    "manufacturerDescription" TEXT,
    "manufacturerPigmentDescription" TEXT,
    "hex" TEXT,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "PigmentType" NOT NULL DEFAULT E'CIPIGMENT',
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "imageKitUploadId" INTEGER,

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
    "label" TEXT NOT NULL,
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
CREATE TABLE "SwatchCard" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "paperId" INTEGER,
    "swatchCardTypeName" "SwatchCardTypeName",
    "authorId" INTEGER,
    "description" TEXT,
    "imageKitUploadId" INTEGER,

    CONSTRAINT "SwatchCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwatchCardsOnPaint" (
    "id" SERIAL NOT NULL,
    "paintId" INTEGER NOT NULL,
    "gradientId" INTEGER,
    "granulationId" INTEGER,
    "dispersementId" INTEGER,
    "highDilutionId" INTEGER,
    "midDilutionId" INTEGER,
    "masstoneId" INTEGER,
    "glazeId" INTEGER,
    "wetLiftId" INTEGER,
    "dryLiftId" INTEGER,

    CONSTRAINT "SwatchCardsOnPaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwatchCardType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" "SwatchCardTypeName" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SwatchCardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturerId" INTEGER,
    "lineId" INTEGER,
    "description" TEXT NOT NULL,
    "weightInLbs" INTEGER NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "paintId" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "noteId" INTEGER,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" CITEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturerId" INTEGER,
    "name" CITEXT NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "PaintType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fileId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageKitUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Paint_slug_key" ON "Paint"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Paint_manufacturerId_productColorName_key" ON "Paint"("manufacturerId", "productColorName");

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_type_colorId_number_key" ON "Pigment"("type", "colorId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_label_slug_key" ON "Tag"("label", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "SwatchCardsOnPaint_paintId_key" ON "SwatchCardsOnPaint"("paintId");

-- CreateIndex
CREATE UNIQUE INDEX "SwatchCardType_name_key" ON "SwatchCardType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Line_name_key" ON "Line"("name");

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

-- AddForeignKey
ALTER TABLE "Paint" ADD CONSTRAINT "Paint_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_imageKitUploadId_fkey" FOREIGN KEY ("imageKitUploadId") REFERENCES "ImageKitUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentsOnPaints" ADD CONSTRAINT "PigmentsOnPaints_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentsOnPaints" ADD CONSTRAINT "PigmentsOnPaints_pigmentId_fkey" FOREIGN KEY ("pigmentId") REFERENCES "Pigment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPaints" ADD CONSTRAINT "TagsOnPaints_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPaints" ADD CONSTRAINT "TagsOnPaints_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_swatchCardTypeName_fkey" FOREIGN KEY ("swatchCardTypeName") REFERENCES "SwatchCardType"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_imageKitUploadId_fkey" FOREIGN KEY ("imageKitUploadId") REFERENCES "ImageKitUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_gradientId_fkey" FOREIGN KEY ("gradientId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_granulationId_fkey" FOREIGN KEY ("granulationId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_dispersementId_fkey" FOREIGN KEY ("dispersementId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_highDilutionId_fkey" FOREIGN KEY ("highDilutionId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_midDilutionId_fkey" FOREIGN KEY ("midDilutionId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_masstoneId_fkey" FOREIGN KEY ("masstoneId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_glazeId_fkey" FOREIGN KEY ("glazeId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_wetLiftId_fkey" FOREIGN KEY ("wetLiftId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCardsOnPaint" ADD CONSTRAINT "SwatchCardsOnPaint_dryLiftId_fkey" FOREIGN KEY ("dryLiftId") REFERENCES "SwatchCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "Line"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_paintId_fkey" FOREIGN KEY ("paintId") REFERENCES "Paint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
