require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');
const { createReadStream } = require('fs');

const prisma = new PrismaClient({ log: ["info", "warn"] });

const processFile = async (file) => {
  const records = [];
  const parser = createReadStream(file)
    .pipe(parse({
      // CSV options if any
      columns: true,
    }));

  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};


async function main() {
  // CSV Files
  const manufacturerCsv = `${__dirname}/manufacturer.csv`;
  const lineCsv = `${__dirname}/line.csv`;
  const colorCsv = `${__dirname}/color.csv`;
  const pigmentCsv = `${__dirname}/pigment.csv`;
  const paintCsv = `${__dirname}/temp-paints.csv`;
  
  // Process CSV files
  const parsedManufacturerCsv = await processFile(manufacturerCsv);
  const parsedLineCsv = await processFile(lineCsv);
  const parsedColorCsv = await processFile(colorCsv);
  const parsedPigmentCsv = await processFile(pigmentCsv);
  const parsedPaintCsv = await processFile(paintCsv);

  const manufacturerImport = await prisma.manufacturer.createMany({
    data: parsedManufacturerCsv,
    skipDuplicates: true,
  })

  const colorImport = await prisma.color.createMany({
    data: parsedColorCsv,
    skipDuplicates: true,
  })

  const pigmentImport = await prisma.pigment.createMany({
    data: parsedPigmentCsv,
    skipDuplicates: true,
  })

  // const lineImport = parsedLineCsv.forEach(async (line) => {
  //   await prisma.line.create({
  //     data: {
  //       name: line.name,
  //       manufacturer: {
  //         connect: { name: line.manufacturer }
  //       }
  //     }
  //   })
  // })

  const unknownPaper = await prisma.paper.create({
    data: {
      description: 'Unknown Paper',
      weightInLbs: 0,
    },
  });

  const paper = await prisma.paper.create({
    data: {
      description: 'Cold Press',
      weightInLbs: 140,
      manufacturerId: 1,
    },
  });

  const paintType = await prisma.paintType.upsert({
    where: { slug: 'watercolor' },
    update: {},
    create: {
      label: 'Watercolor',
      slug: 'watercolor',
    },
  });

  const lightfastRatings = await prisma.lightfastRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      {
        label: 'I',
        description:
          'Excellent lightfastness. Blue wool 7-8. The pigment will remain unchanged for more than 100 years of light exposure with proper mounting and display. (Suitable for artistic use.)',
      },
      {
        label: 'II',
        description:
          'Very good lightfastness. Blue wool 6. The pigment will remain unchanged for 50 to 100 years of light exposure with proper mounting and display. (Suitable for artistic use.)',
      },
      {
        label: 'III',
        description:
          'Fair lightfastness (Impermanent). Blue wool 4-5. The pigment will remain unchanged for 15 to 50 years with proper mounting and display. ("May be satisfactory when used full strength or with extra protection from exposure to light.")',
      },
      {
        label: 'IV',
        description:
          'Poor lightfastness (Fugitive). Blue wool 2-3. The pigment begins to fade in 2 to 15 years, even with proper mounting and display. (Not suitable for artistic use.)',
      },
      {
        label: 'V',
        description:
          'Very poor lightfastness (Fugitive). Blue wool 1. The pigment begins to fade in 2 years or less of light exposure, even with proper mounting and display. (Not suitable for artistic use.)',
      },
    ],
  });

  const transparencyRatings = await prisma.transparencyRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      { label: '1', description: 'Opaque' },
      { label: '2', description: 'Semi-Opaque' },
      { label: '3', description: 'Semi-Transparent' },
      { label: '4', description: 'Transparent' },
    ],
  });

  const stainingRatings = await prisma.stainingRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      { label: 'High-Staining' },
      { label: 'Medium-Staining' },
      { label: 'Low-Staining' },
      { label: 'Non-Staining' },
    ],
  });

  const granulationRatings = await prisma.granulationRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      { label: 'Yes' },
      { label: 'No' },
    ],
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paintlibrary.com' },
    update: {},
    create: {
      email: 'admin@paintlibrary.com',
      displayName: 'Admin the Human',
      hashedPassword: 'password',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: 'member@paintlibrary.foo' },
    update: {},
    create: {
      email: 'member@paintlibrary.foo',
      displayName: 'Entity Member',
      hashedPassword: 'password',
      status: 'ACTIVE',
    },
  });

  const swatchCardTypes = await prisma.swatchCardType.createMany({
    data: [
      { label: 'Gradient Wash', description: 'More paint to more water.', name: 'GRADIENT' },
      {
        label: 'Granulation',
        description: 'Particle separation and texture in wet wash.',
        name: 'GRANULATION',
      },
      { label: 'Dispersement', description: 'Flow of paint on wet paper.', name: 'DISPERSEMENT' },
      {
        label: 'High Dilution Undertone',
        description: 'Highly diluted, on dry paper.',
        name: 'HIGH_DILUTION',
      },
      {
        label: 'Mid Dilution Undertone',
        description: '50% dilution, on dry paper.',
        name: 'MID_DILUTION',
      },
      {
        label: 'Masstone',
        description: 'Full strength, undiluted, on dry paper.',
        name: 'MASSTONE',
      },
      { label: 'Glaze', description: 'Layered after dry.', name: 'GLAZE' },
      {
        label: 'Wet Lift',
        description: 'Wet brush with clean water "erasing" after dry.',
        name: 'WET_LIFT',
      },
      { label: 'Dry Lift', description: 'Dry brush or tissue lifting wet wash', name: 'DRY_LIFT' },
    ],
  });

  const lightfastRating = await prisma.lightfastRating.findFirst({
    where: { label: 'I' },
  });
  const transparencyRating = await prisma.transparencyRating.findFirst({
    where: { label: '1' },
  });
  const stainingRating = await prisma.stainingRating.findFirst({
    where: { label: 'Low-Staining' },
  });
  const granulationRating = await prisma.granulationRating.findFirst({
    where: { label: 'Yes' },
  });

  const tags = await prisma.tag.createMany({
    data: [
      { label: 'tropical', slug: 'tropical' },
      { label: 'bird feathers', slug: 'bird-feathers' },
      { label: 'nautical', slug: 'nautical' },
    ],
  });

  const imageKitUpload = await prisma.imageKitUpload.create({
    data: {
      fileId: 'test-id-string',
      filePath: 'kitten.jpg',
      name: 'kitten.jpg',
      thumbnailUrl: 'https://placekitten.com/50/50',
      url: 'https://placekitten.com/350/350',
    },
  });

  const createPaint = {
    slug: '',
    published: true,
    authorId: adminUser.id,
    manufacturerId: 1,
    paintTypeId: paintType.id,
    productColorName: 'Test Paint',
    communityDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
    manufacturerDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
    manufacturerPigmentDescription: 'Some pigment | Series 3',
    lightfastRatingId: lightfastRating.id,
    transparencyRatingId: transparencyRating.id,
    stainingRatingId: stainingRating.id,
    granulationRatingId: granulationRating.id,
    hex: '#ffbf00',
  }

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
  ]

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
  ]

  const swatchCardsOnPaint = {
    gradient: {
      create: {
        paperId: paper.id,
        authorId: memberUser.id,
        swatchCardTypeName: 'GRADIENT',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: imageKitUpload.id,
      },
    },
    granulation: {
      create: {
        paperId: paper.id,
        authorId: memberUser.id,
        swatchCardTypeName: 'GRANULATION',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: imageKitUpload.id,
      },
    },
    dispersement: {
      create: {
        paperId: paper.id,
        authorId: memberUser.id,
        swatchCardTypeName: 'DISPERSEMENT',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: imageKitUpload.id,
      },
    },
    highDilution: {
      create: {
        paperId: paper.id,
        authorId: memberUser.id,
        swatchCardTypeName: 'HIGH_DILUTION',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: imageKitUpload.id,
      },
    },
    midDilution: {
      create: {
        paperId: paper.id,
        authorId: memberUser.id,
        swatchCardTypeName: 'MID_DILUTION',
        description: 'This is a supercool wash, with extra awesome.',
        imageKitUploadId: imageKitUpload.id,
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
  }

  const paintImport = parsedPaintCsv.forEach(async (paint) => {
    await prisma.paint.create({
      data: {
        slug: paint.slug,
        published: true,
        authorId:  Number(paint.authorId),
        manufacturerId: Number(paint.manufacturerId),
        paintTypeId: Number(paint.paintTypeId),
        productColorName: paint.productColorName,
        communityDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
        manufacturerDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
        lightfastRatingId:  Number(paint.lightfastRatingId),
        transparencyRatingId: Number(paint.transparencyRatingId),
        stainingRatingId: Number(paint.stainingRatingId),
        granulationRatingId: Number(paint.granulationRatingId),
        hex: paint.hex,
        swatchCardsOnPaint: {
          create: swatchCardsOnPaint
        },
        tags: {
          create: tagsForPaint
        },
        pigmentsOnPaints: {
          create: pigmentsOnPaints
        }
      }
    })
  })

  const notes = await prisma.note.createMany({
    data: [
      {
        authorId: adminUser.id,
        paintId: 1,
        approved: true,
        content: 'This is a cool comment about this paint.',
      },
      {
        authorId: memberUser.id,
        paintId: 1,
        approved: true,
        content: 'This is a totally uncool comment about this paint.',
      },
    ],
  });

  const parentNote = await prisma.note.findFirst({
    where: { authorId: adminUser.id },
  });

  const childNotes = await prisma.note.createMany({
    data: [
      {
        authorId: adminUser.id,
        paintId: 1,
        approved: true,
        content: 'This is a cool reply to this note.',
        noteId: parentNote.id,
      },
      {
        authorId: memberUser.id,
        paintId: 1,
        approved: true,
        content: 'This is a totally uncool reply to this note.',
        noteId: parentNote.id,
      },
    ],
  });


  console.log({
    manufacturerImport,
    colorImport,
    pigmentImport,
    unknownPaper,
    paper,
    paintType,
    granulationRatings,
    lightfastRatings,
    transparencyRatings,
    stainingRatings,
    swatchCardTypes,
    adminUser,
    memberUser,
    notes,
    childNotes,
    tags,
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
