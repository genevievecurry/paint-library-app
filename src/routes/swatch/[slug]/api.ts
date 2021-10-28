import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function send({ method, slug}) {
  let body;
  let status = 500;

  if(method === 'GET') {
    body = await prisma.swatch.findUnique({
      where: {
        slug
      },
      include: {
        notes: true,
        swatchCards: true,
        tags: true,
      }
    })

    body.pigmentData = await prisma.$queryRaw(
      Prisma.sql`SELECT p.type, p.name, p.number, c.label AS "colorLabel", c.slug AS "colorSlug", c.code AS "colorCode" FROM "PigmentOnSwatch" pos INNER JOIN "Pigment" p ON pos."pigmentId" = p.id LEFT JOIN "Color" c ON p."colorId" = c.id WHERE pos."swatchId" = ${body.id}`
    )

    // Oh dear lord is this even ok
    body.swatchCardData = await prisma.$queryRaw(
      Prisma.sql`SELECT sc.description, p.description AS "paperDescription", p."weightInLbs" AS "paperWeightInLbs", m.name AS "paperManufacturer", sct.label AS "typeLabel", sct.description AS "typeDescription", u."displayName" AS "authorDisplayName" FROM "SwatchCard" sc INNER JOIN "Paper" p ON sc."paperId" = p.id LEFT JOIN "SwatchCardType" sct ON sc."swatchCardTypeId" = sct.id INNER JOIN "User" u ON sc."authorId" = u.id INNER JOIN "Manufacturer" m on p."manufacturerId" = m.id WHERE sc."swatchId" = ${body.id}`
    )

    body.manufacturer = await prisma.manufacturer.findUnique({
      where: { 
        id: body.manufacturerId,
      }, 
    })

    body.paintType = await prisma.paintType.findUnique({
      where: { 
        id: body.paintTypeId,
      }, 
    })
    
    const lightfastRating = await prisma.lightfastRating.findUnique({
      where: { 
        id: body.lightfastRatingId,
      }, 
    })

    const transparencyRating = await prisma.transparencyRating.findUnique({
      where: { 
        id: body.transparencyRatingId,
      }, 
    })

    const stainingRating = await prisma.stainingRating.findUnique({
      where: { 
        id: body.stainingRatingId,
      }, 
    })

    const granulationRating = await prisma.granulationRating.findUnique({
      where: { 
        id: body.granulationRatingId,
      }, 
    })

    body.ratings = {
      lightfastRating,
      transparencyRating,
      stainingRating,
      granulationRating
    }

    status = 200;
  }

  return {
    status,
    body
  }
}

export function get(slug: string) {
  return send({ method: 'GET', slug})
}
