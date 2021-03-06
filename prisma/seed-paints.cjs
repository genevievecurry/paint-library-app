require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');
const { createReadStream } = require('fs');

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

async function main() {
  // const manufacturers = await prisma.manufacturer.count();
  const manufacturers = 3;
  const paintCsv = `${__dirname}/temp-paints.csv`;
  const parsedPaintCsv = await processFile(paintCsv);

  function setPigmentOnPaint() {
    const numberOfPigments = Math.floor(Math.random() * 6);
    const popArray = [];

    for (let index = 0; index < numberOfPigments; index++) {
      const pigmentId = Math.floor(Math.random() * 100) + 1;
      popArray.push({
        pigment: {
          connect: {
            id: pigmentId,
          },
        },
      });
    }

    return popArray;
  }

  const tags = await prisma.tag.createMany({
    data: [
      { label: 'tropical', slug: 'tropical' },
      { label: 'bird feathers', slug: 'bird-feathers' },
      { label: 'nautical', slug: 'nautical' },
    ],
  });

  const tagsForPaint = [
    {
      setAt: new Date(),
      tag: {
        connect: {
          id: 1,
        },
      },
    },
    {
      setAt: new Date(),
      tag: {
        connect: {
          id: 2,
        },
      },
    },
    {
      setAt: new Date(),
      tag: {
        connect: {
          id: 3,
        },
      },
    },
  ];

  const imageKitUploads = await prisma.imageKitUpload.createMany({
    data: [
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/100/150',
        url: 'https://placekitten.com/750/350',
        width: 750,
        height: 350,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/650/250',
        width: 650,
        height: 250,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/450/650',
        width: 450,
        height: 650,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/150/350',
        width: 150,
        height: 350,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/250/450',
        width: 250,
        height: 450,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/350/350',
        width: 350,
        height: 350,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/350/350',
        width: 350,
        height: 350,
      },
      {
        fileId: 'test-id-string',
        filePath: 'kitten.jpg',
        name: 'kitten.jpg',
        thumbnailUrl: 'https://placekitten.com/150/100',
        url: 'https://placekitten.com/450/350',
        width: 450,
        height: 350,
      },
    ],
  });

  const paintImport = parsedPaintCsv.forEach(async (paint, i) => {
    for (let j = 1; j < manufacturers; j++) {
      let item = await prisma.paint.create({
        data: {
          uuid: `${paint.slug}-${i}-${j}`,
          slug: `${paint.slug}`,
          published: true,
          authorUuid: '37287234987',
          manufacturerId: j,
          paintTypeId: Number(paint.paintTypeId),
          name: paint.name,
          communityDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
          manufacturerDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
          lightfastRatingId: Number(paint.lightfastRatingId),
          transparencyRatingId: Number(paint.transparencyRatingId),
          stainingRatingId: Number(paint.stainingRatingId),
          granulationRatingId: Number(paint.granulationRatingId),
          hex: paint.hex,
          swatchCard: {
            createMany: {
              data: [
                {
                  paperTypeId: j,
                  paperWeightInLbs: 140,
                  paperManufacturerId: j,
                  paperLineId: j,
                  authorUuid: '37287234987',
                  description: 'This is actually a cat, not a swatch.',
                  imageKitUploadId: j,
                },
                {
                  paperTypeId: j + 1,
                  paperWeightInLbs: 140,
                  paperManufacturerId: j + 1,
                  paperLineId: j + 1,
                  authorUuid: '37287234987',
                  description: 'This is actually a cat, not a swatch.',
                  imageKitUploadId: j + 1,
                },
              ],
            },
          },
          tags: {
            create: tagsForPaint,
          },
          pigmentsOnPaints: {
            create: setPigmentOnPaint(),
          },
        },
      });
    }
    if (i === parsedPaintCsv.length) {
      console.log('Whew, done with paints!');
    }
  });

  const notes = await prisma.note.createMany({
    data: [
      {
        authorUuid: '37287234987',
        paintId: 1,
        approved: true,
        content: 'This is a cool comment about this paint.',
      },
      {
        authorUuid: '372sdf34987',
        paintId: 1,
        approved: true,
        content: 'This is a totally uncool comment about this paint.',
      },
    ],
  });

  const parentNote = await prisma.note.findFirst({
    where: { authorUuid: '37287234987' },
  });

  const childNotes = await prisma.note.createMany({
    data: [
      {
        authorUuid: '37287234987',
        paintId: 1,
        approved: true,
        content: 'This is a cool reply to this note.',
        noteId: parentNote.id,
      },
      {
        authorUuid: '372sdf34987',
        paintId: 1,
        approved: true,
        content: 'This is a totally uncool reply to this note.',
        noteId: parentNote.id,
      },
    ],
  });

  const palette = await prisma.palette.create({
    data: {
      uuid: '3329435-34534535',
      slug: 'watercolor-dream-palette',
      title: 'Watercolor Dream Palette',
      description:
        'This is a short description, limited in length, that describes the intent behind this palette. It is purely optional and might not appear.',
      ownerUuid: '37287234987',
      savedByUsers: {
        create: [
          { user: { connect: { id: 1 } } },
          { user: { connect: { id: 2 } } },
        ],
      },
      paintsInPalette: {
        create: [
          {
            order: 1,
            paint: {
              connect: {
                id: 1,
              },
            },
          },
          {
            order: 2,
            paint: {
              connect: {
                id: 2,
              },
            },
          },
          {
            order: 3,
            paint: {
              connect: {
                id: 3,
              },
            },
          },
          {
            order: 4,
            paint: {
              connect: {
                id: 4,
              },
            },
          },
          {
            order: 5,
            paint: {
              connect: {
                id: 5,
              },
            },
          },
          {
            order: 6,
            paint: {
              connect: {
                id: 6,
              },
            },
          },
        ],
      },
    },
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
