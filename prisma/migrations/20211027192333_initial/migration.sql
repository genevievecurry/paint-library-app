CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'BANNED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "email" CITEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MEMBER',
    "status" "UserStatus" NOT NULL DEFAULT E'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swatch" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "manufacturerId" INTEGER,
    "paintTypeId" INTEGER NOT NULL,
    "productUrl" TEXT,
    "productColorName" TEXT NOT NULL,
    "communityDescription" TEXT,
    "manufacturerDescription" TEXT,
    "manufacturerPigmentDescription" TEXT,

    CONSTRAINT "Swatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingOnSwatch" (
    "id" SERIAL NOT NULL,
    "swatchId" INTEGER NOT NULL,
    "lightfastRatingId" INTEGER NOT NULL,
    "transparencyRatingId" INTEGER NOT NULL,
    "stainingRatingId" INTEGER NOT NULL,
    "granulationRatingId" INTEGER NOT NULL,

    CONSTRAINT "RatingOnSwatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pigment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,

    CONSTRAINT "Pigment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PigmentOnSwatch" (
    "swatchId" INTEGER NOT NULL,
    "pigmentId" INTEGER NOT NULL,

    CONSTRAINT "PigmentOnSwatch_pkey" PRIMARY KEY ("swatchId","pigmentId")
);

-- CreateTable
CREATE TABLE "SwatchCard" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "swatchId" INTEGER NOT NULL,
    "paperId" INTEGER NOT NULL,
    "swatchCardTypeId" INTEGER,
    "authorId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "SwatchCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwatchCardType" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "SwatchCardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paper" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manufacturerId" INTEGER,
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
    "swatchId" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "noteId" INTEGER,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "swatchId" INTEGER NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Swatch_slug_key" ON "Swatch"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Swatch_manufacturerId_productColorName_key" ON "Swatch"("manufacturerId", "productColorName");

-- CreateIndex
CREATE UNIQUE INDEX "RatingOnSwatch_swatchId_key" ON "RatingOnSwatch"("swatchId");

-- CreateIndex
CREATE UNIQUE INDEX "Pigment_code_key" ON "Pigment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_label_slug_key" ON "Tag"("label", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

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
ALTER TABLE "Swatch" ADD CONSTRAINT "Swatch_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swatch" ADD CONSTRAINT "Swatch_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swatch" ADD CONSTRAINT "Swatch_paintTypeId_fkey" FOREIGN KEY ("paintTypeId") REFERENCES "PaintType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnSwatch" ADD CONSTRAINT "RatingOnSwatch_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnSwatch" ADD CONSTRAINT "RatingOnSwatch_lightfastRatingId_fkey" FOREIGN KEY ("lightfastRatingId") REFERENCES "LightfastRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnSwatch" ADD CONSTRAINT "RatingOnSwatch_transparencyRatingId_fkey" FOREIGN KEY ("transparencyRatingId") REFERENCES "TransparencyRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnSwatch" ADD CONSTRAINT "RatingOnSwatch_stainingRatingId_fkey" FOREIGN KEY ("stainingRatingId") REFERENCES "StainingRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingOnSwatch" ADD CONSTRAINT "RatingOnSwatch_granulationRatingId_fkey" FOREIGN KEY ("granulationRatingId") REFERENCES "GranulationRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pigment" ADD CONSTRAINT "Pigment_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentOnSwatch" ADD CONSTRAINT "PigmentOnSwatch_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PigmentOnSwatch" ADD CONSTRAINT "PigmentOnSwatch_pigmentId_fkey" FOREIGN KEY ("pigmentId") REFERENCES "Pigment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_swatchCardTypeId_fkey" FOREIGN KEY ("swatchCardTypeId") REFERENCES "SwatchCardType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
