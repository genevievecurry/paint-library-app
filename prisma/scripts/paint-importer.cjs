const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');
const { createReadStream } = require('fs');
const { v4 } = require('uuid');

const prisma = new PrismaClient({ log: ['info', 'warn'] });

const processFile = async (file) => {
  const records = [];
  const parser = createReadStream(file).pipe(
    parse({
      // CSV options if any
      columns: true,
    }),
  );

  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

const generateSlug = ({ value, uuid = false }) => {
  const result = value
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  if (uuid === true) {
    return result.concat(`-${uuidv4()}`);
  }

  return result;
};

async function main() {
  const importPaintCsv = `${__dirname}/paint-import-8-11-22.csv`;
  const parsedPaintCsv = await processFile(importPaintCsv);

  async function getPigmentBySlug(slug) {
    return await prisma.pigment.findUnique({
      where: {
        slug: slug,
      },
      select: {
        id: true,
      },
    });
  }

  async function setPigmentOnPaint(pigmentIds) {
    const pigmentSlugs = pigmentIds ? pigmentIds.split('|').filter(n => n).map(x => x.trim()) : [];
    const results = await Promise.all(
      pigmentSlugs.map(async (slug) => {
        const pigmentId = await getPigmentBySlug(slug);

        return {
          pigment: {
            connect: {
              id: pigmentId?.id ? pigmentId.id : undefined,
            },
          },
        };
      }),
    );
    return results;
  }

  async function getManufacturerByName(name) {
    return await prisma.manufacturer.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
  }

  async function manufacturerId(manufacturerName) {
    const manufacturer = await getManufacturerByName(manufacturerName);
    return manufacturer.id;
  }

  async function getLineByName(name) {
    return await prisma.line.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
  }

  async function lineId(lineName) {
    const line = await getLineByName(lineName);
    return line.id;
  }

  const paintImport = parsedPaintCsv.forEach(async (paint) => {
    const newPaint = await prisma.paint.upsert({
      where: {
        manufacturerId_name: {
          manufacturerId: await manufacturerId(paint.manufacturer),
          name: paint.name,
        }
      },
      update: {
        hex: paint.hex,
        line: paint.lineId
          ? { connect: { id: Number(paint.lineId) } }
          : undefined,
        lightfastRating: { connect: { code: paint.lightfastRating || 'X' } },
        transparencyRating: { connect: { code: paint.transparencyRating || 'X' } },
        stainingRating: { connect: { code: paint.stainingRating || 'X' } },
        granulationRating: { connect: { code: paint.granulationRating || 'X' } },
        manufacturerDescription: paint.manufacturerDescription,
        productUrl: paint.url,
      },
      create: {
        uuid: v4(),
        name: paint.name,
        slug: generateSlug({ value: paint.name, uuid: false }),
        manufacturer: {
          connect: { id: await manufacturerId(paint.manufacturer) },
        },
        hex: paint.hex,
        line: paint.lineId
          ? { connect: { id: Number(paint.lineId) } }
          : undefined,
        paintType: { connect: { id: 1 } },
        author: { connect: { uuid: '37287234987' } },
        lightfastRating: { connect: { code: paint.lightfastRating || 'X' } },
        transparencyRating: { connect: { code: paint.transparencyRating || 'X' } },
        stainingRating: { connect: { code: paint.stainingRating || 'X' } },
        granulationRating: { connect: { code: paint.granulationRating || 'X' } },
        manufacturerDescription: paint.manufacturerDescription,
        productUrl: paint.url,
        published: true,
        pigmentsOnPaints: paint.pigmentSlugs ? {
          create: await setPigmentOnPaint(paint.pigmentSlugs),
        } : undefined,
      },
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
