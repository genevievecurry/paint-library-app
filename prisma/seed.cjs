const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const unknownManufacturer = await prisma.manufacturer.upsert({
    where: { name: 'Unknown Manufacturer' },
    update: {},
    create: {
      name: 'Unknown Manufacturer',
      website: '',
    },
  });

  const manufacturer = await prisma.manufacturer.upsert({
    where: { name: 'Daniel Smith' },
    update: {},
    create: {
      name: 'Daniel Smith',
      website: 'https://danielsmith.com/',
    },
  });

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
      manufacturerId: manufacturer.id,
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

  const colors = await prisma.color.createMany({
    data: [
      { label: 'Yellow', slug: 'yellow', code: 'Y' },
      { label: 'Orange', slug: 'orange', code: 'O' },
      { label: 'Red', slug: 'red', code: 'R' },
      { label: 'Violet', slug: 'violet', code: 'V' },
      { label: 'Blue', slug: 'blue', code: 'B' },
      { label: 'Green', slug: 'green', code: 'G' },
      { label: 'Brown', slug: 'brown', code: 'Br' },
      { label: 'Black', slug: 'black', code: 'Bk' },
      { label: 'White', slug: 'white', code: 'W' },
      { label: 'Metal', slug: 'metal', code: 'M' },
    ],
  });

  const color = await prisma.color.findFirst({
    where: { code: 'Y' },
  });

  const pigment = await prisma.pigment.create({
    data: {
      name: 'Nickel Dioxime Yellow',
      number: 153,
      colorId: color.id,
    },
  });

  const additionalPigments = await prisma.pigment.createMany({
    data: [
      { name: 'Diarylide Yellow', number: 98, colorId: color.id },
      { name: 'Tartrazine Lake', number: 100, colorId: color.id },
      { name: 'Lumogen Yellow', number: 101, colorId: color.id },
    ],
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

  let watercolor = await prisma.paint.upsert({
    where: { slug: 'test-paint' },
    update: {},
    create: {
      slug: 'test-paint',
      published: true,
      authorId: adminUser.id,
      manufacturerId: manufacturer.id,
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
      pigments: {
        create: [
          {
            pigment: {
              connect: {
                id: pigment.id,
              },
            },
          },
        ],
      },
      tags: {
        create: [
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
        ],
      },
      swatchCardsOnPaint: {
        create: {
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
              paperId: paper.id,
              authorId: memberUser.id,
              swatchCardTypeName: 'MASSTONE',
              description: 'This is a supercool wash, with extra awesome.',
              imageKitUploadId: imageKitUpload.id,
            },
          },
          glaze: {
            create: {
              paperId: paper.id,
              authorId: memberUser.id,
              swatchCardTypeName: 'GLAZE',
              description: 'This is a supercool wash, with extra awesome.',
              imageKitUploadId: imageKitUpload.id,
            },
          },
          wetLift: {
            create: {
              paperId: paper.id,
              authorId: memberUser.id,
              swatchCardTypeName: 'WET_LIFT',
              description: 'This is a supercool wash, with extra awesome.',
              imageKitUploadId: imageKitUpload.id,
            },
          },
          dryLift: {
            create: {
              paperId: paper.id,
              authorId: memberUser.id,
              swatchCardTypeName: 'DRY_LIFT',
              description: 'This is a supercool wash, with extra awesome.',
              imageKitUploadId: imageKitUpload.id,
            },
          },
        },
      },
    },
  });

  const notes = await prisma.note.createMany({
    data: [
      {
        authorId: adminUser.id,
        paintId: watercolor.id,
        approved: true,
        content: 'This is a cool comment about this paint.',
      },
      {
        authorId: memberUser.id,
        paintId: watercolor.id,
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
        paintId: watercolor.id,
        approved: true,
        content: 'This is a cool reply to this note.',
        noteId: parentNote.id,
      },
      {
        authorId: memberUser.id,
        paintId: watercolor.id,
        approved: true,
        content: 'This is a totally uncool reply to this note.',
        noteId: parentNote.id,
      },
    ],
  });

  console.log({
    unknownManufacturer,
    manufacturer,
    unknownPaper,
    paper,
    paintType,
    colors,
    pigment,
    additionalPigments,
    granulationRatings,
    lightfastRatings,
    transparencyRatings,
    stainingRatings,
    swatchCardTypes,
    adminUser,
    memberUser,
    watercolor,
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
