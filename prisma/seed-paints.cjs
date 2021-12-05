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
  const manufacturers = await prisma.manufacturer.count();
  const paintCsv = `${__dirname}/temp-paints.csv`;
  const parsedPaintCsv = await processFile(paintCsv);

  const pigmentsOnPaints = [
    {
      pigment: {
        connect: {
          id: 1,
        },
      },
    },
    {
      pigment: {
        connect: {
          id: 5,
        },
      },
    },
  ];

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

  const swatchCardsOnPaint = {
    gradient: {
      create: {
        paperId: 1,
        authorId: 2,
        swatchCardTypeName: 'GRADIENT',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: 1,
      },
    },
    granulation: {
      create: {
        paperId: 1,
        authorId: 2,
        swatchCardTypeName: 'GRANULATION',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: 2,
      },
    },
    dispersement: {
      create: {
        paperId: 1,
        authorId: 2,
        swatchCardTypeName: 'DISPERSEMENT',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: 3,
      },
    },
    highDilution: {
      create: {
        paperId: 1,
        authorId: 2,
        swatchCardTypeName: 'HIGH_DILUTION',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: 4,
      },
    },
    midDilution: {
      create: {
        paperId: 1,
        authorId: 2,
        swatchCardTypeName: 'MID_DILUTION',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: 5,
      },
    },
    masstone: {
      create: {
        swatchCardTypeName: 'MASSTONE',
      },
    },
    glaze: {
      create: {
        swatchCardTypeName: 'GLAZE',
      },
    },
    wetLift: {
      create: {
        swatchCardTypeName: 'WET_LIFT',
      },
    },
    dryLift: {
      create: {
        swatchCardTypeName: 'DRY_LIFT',
      },
    },
  };

  const paintImport = parsedPaintCsv.forEach(async (paint, i) => {
    for (let j = 1; j < manufacturers; j++) {
      let item = await prisma.paint.create({
        data: {
          slug: `${paint.slug}-${i}-${j}`,
          published: true,
          authorId: Number(paint.authorId),
          manufacturerId: j,
          paintTypeId: Number(paint.paintTypeId),
          productColorName: paint.productColorName,
          communityDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
          manufacturerDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
          lightfastRatingId: Number(paint.lightfastRatingId),
          transparencyRatingId: Number(paint.transparencyRatingId),
          stainingRatingId: Number(paint.stainingRatingId),
          granulationRatingId: Number(paint.granulationRatingId),
          hex: paint.hex,
          swatchCardsOnPaint: {
            create: swatchCardsOnPaint,
          },
          tags: {
            create: tagsForPaint,
          },
          pigmentsOnPaints: {
            create: pigmentsOnPaints,
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
        authorId: 1,
        paintId: 1,
        approved: true,
        content: 'This is a cool comment about this paint.',
      },
      {
        authorId: 1,
        paintId: 1,
        approved: true,
        content: 'This is a totally uncool comment about this paint.',
      },
    ],
  });

  const parentNote = await prisma.note.findFirst({
    where: { authorId: 1 },
  });

  const childNotes = await prisma.note.createMany({
    data: [
      {
        authorId: 1,
        paintId: 1,
        approved: true,
        content: 'This is a cool reply to this note.',
        noteId: parentNote.id,
      },
      {
        authorId: 2,
        paintId: 1,
        approved: true,
        content: 'This is a totally uncool reply to this note.',
        noteId: parentNote.id,
      },
    ],
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
