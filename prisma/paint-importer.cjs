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
  const importPaintCsv = `${__dirname}/test-paint-import.csv`;
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
    const pigmentSlugs = pigmentIds.split('|');
    const results = await Promise.all(
      pigmentSlugs.map(async (slug) => {
        const pigmentId = await getPigmentBySlug(slug);

        return {
          pigment: {
            connect: {
              id: pigmentId.id,
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

  const paintImport = parsedPaintCsv.forEach(async (paint, i) => {
    const newPaint = await prisma.paint.create({
      data: {
        uuid: v4(),
        name: paint.name,
        slug: generateSlug({ value: paint.name, uuid: false }),
        hex: paint.hex,
        manufacturer: {
          connect: { id: await manufacturerId(paint.manufacturer) },
        },
        line: paint.lineId
          ? { connect: { id: Number(paint.lineId) } }
          : undefined,
        paintType: { connect: { id: 1 } },
        author: { connect: { uuid: '37287234987' } },
        lightfastRating: { connect: { id: 1 } },
        transparencyRating: { connect: { id: 1 } },
        stainingRating: { connect: { id: 1 } },
        granulationRating: { connect: { id: 1 } },
        published: true,
        pigmentsOnPaints: {
          create: await setPigmentOnPaint(paint.pigmentSlugs),
        },
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
