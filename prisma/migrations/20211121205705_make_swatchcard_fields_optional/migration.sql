-- DropForeignKey
ALTER TABLE "SwatchCard" DROP CONSTRAINT "SwatchCard_authorId_fkey";

-- DropForeignKey
ALTER TABLE "SwatchCard" DROP CONSTRAINT "SwatchCard_paperId_fkey";

-- AlterTable
ALTER TABLE "SwatchCard" ALTER COLUMN "paperId" DROP NOT NULL,
ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwatchCard" ADD CONSTRAINT "SwatchCard_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
