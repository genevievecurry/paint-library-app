const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const manufacturer = await prisma.manufacturer.upsert({
    where: { name: 'Daniel Smith' },
    update: {},
    create: {
      name: 'Daniel Smith',
      website: 'https://danielsmith.com/'
    }
  });

  const paper = await prisma.paper.create({
    data: {
      description: 'Cold Press',
      weightInLbs: 140,
      manufacturerId: manufacturer.id
    }
  });

  const paintType = await prisma.paintType.upsert({
    where: { slug: 'watercolor' },
    update: {},
    create: {
      label: 'Watercolor',
      slug: 'watercolor'
    }
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
      { label: 'Metal', slug: 'metal', code: 'M' }
    ]
  });

  const color = await prisma.color.findFirst({
    where: { code: 'Y' }
  });

  const pigment = await prisma.pigment.create({
    data: {
      name: 'Nickel Dioxime Yellow',
      number: 153,
      colorId: color.id
    }
  });

  const lightfastRatings = await prisma.lightfastRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      {
        label: 'I',
        description:
          'Excellent lightfastness. Blue wool 7-8. The pigment will remain unchanged for more than 100 years of light exposure with proper mounting and display. (Suitable for artistic use.)'
      },
      {
        label: 'II',
        description:
          'Very good lightfastness. Blue wool 6. The pigment will remain unchanged for 50 to 100 years of light exposure with proper mounting and display. (Suitable for artistic use.)'
      },
      {
        label: 'III',
        description:
          'Fair lightfastness (Impermanent). Blue wool 4-5. The pigment will remain unchanged for 15 to 50 years with proper mounting and display. ("May be satisfactory when used full strength or with extra protection from exposure to light.")'
      },
      {
        label: 'IV',
        description:
          'Poor lightfastness (Fugitive). Blue wool 2-3. The pigment begins to fade in 2 to 15 years, even with proper mounting and display. (Not suitable for artistic use.)'
      },
      {
        label: 'V',
        description:
          'Very poor lightfastness (Fugitive). Blue wool 1. The pigment begins to fade in 2 years or less of light exposure, even with proper mounting and display. (Not suitable for artistic use.)'
      }
    ]
  });

  const transparencyRatings = await prisma.transparencyRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      { label: '1', description: 'Opaque' },
      { label: '2', description: 'Semi-Opaque' },
      { label: '3', description: 'Semi-Transparent' },
      { label: '4', description: 'Transparent' }
    ]
  });

  const stainingRatings = await prisma.stainingRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      { label: 'High-Staining' },
      { label: 'Medium-Staining' },
      { label: 'Low-Staining' },
      { label: 'Non-Staining' }
    ]
  });

  const granulationRatings = await prisma.granulationRating.createMany({
    data: [
      { label: 'Unknown', description: 'No data available.' },
      { label: 'Yes' },
      { label: 'No' }
    ]
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paintlibrary.com' },
    update: {},
    create: {
      email: 'admin@paintlibrary.com',
      displayName: 'Admin the Human',
      hashedPassword: 'password',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  const memberUser = await prisma.user.upsert({
    where: { email: 'member@paintlibrary.foo' },
    update: {},
    create: {
      email: 'member@paintlibrary.foo',
      displayName: 'Entity Member',
      hashedPassword: 'password',
      status: 'ACTIVE'
    }
  });

  const swatchCardTypes = await prisma.swatchCardType.createMany({
    data: [
      { label: 'Gradient Wash', description: 'More paint to more water.' },
      { label: 'Granulation', description: 'Partical separation and texture in wet wash.' },
      { label: 'Dispersement', description: 'Flow of paint on wet paper.' },
      { label: 'High dilution undertone', description: 'Highly diluted, on dry paper.' },
      { label: 'Mid dilution undertone', description: '50% dilution, on dry paper.' },
      { label: 'Masstone', description: 'Full strength, undiluted, on dry paper.' },
      { label: 'Glaze', description: 'Layered after dry.' },
      { label: 'Wet Lift', description: 'Wet brush with clean water "erasing" after dry.' },
      { label: 'Dry Lift', description: 'Dry brush or tissue lifting wet wash' }
    ]
  });

  const lightfastRating = await prisma.lightfastRating.findFirst({
    where: { label: 'I' }
  });
  const transparencyRating = await prisma.transparencyRating.findFirst({
    where: { label: '1' }
  });
  const stainingRating = await prisma.stainingRating.findFirst({
    where: { label: 'Low-Staining' }
  });
  const granulationRating = await prisma.granulationRating.findFirst({
    where: { label: 'Yes' }
  });
  const swatchCardType = await prisma.swatchCardType.findFirst();

  let watercolorSwatch = await prisma.swatch.upsert({
    where: { slug: 'watercolor-swatch' },
    update: {},
    create: {
      slug: 'watercolor-swatch',
      published: true,
      authorId: adminUser.id,
      manufacturerId: manufacturer.id,
      paintTypeId: paintType.id,
      productColorName: 'Test Watercolor Swatch',
      communityDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
      manufacturerDescription: '<p>Lorem ipsum.</p><p>Lorem ipsum.</p>',
      manufacturerPigmentDescription: 'Some pigment | Series 3',
      lightfastRatingId: lightfastRating.id,
      transparencyRatingId: transparencyRating.id,
      stainingRatingId: stainingRating.id,
      granulationRatingId: granulationRating.id
    }
  });

  const swatchCards = await prisma.swatchCard.createMany({
    data: [
      {
        swatchId: watercolorSwatch.id,
        paperId: paper.id,
        authorId: memberUser.id,
        swatchCardTypeId: swatchCardType.id,
        description: 'This is a supercool wash, with extra awesome.'
      },
      {
        swatchId: watercolorSwatch.id,
        paperId: paper.id,
        swatchCardTypeId: swatchCardType.id,
        authorId: adminUser.id,
        description:
          'It also has an unusual bonus of being able to be used as a UV reactive paint which glows under black light.'
      },
      {
        swatchId: watercolorSwatch.id,
        paperId: paper.id,
        swatchCardTypeId: swatchCardType.id,
        authorId: memberUser.id,
        description: 'This is a slightly deeper valued green-leaning Phthalo Blue.'
      },
      {
        swatchId: watercolorSwatch.id,
        paperId: paper.id,
        swatchCardTypeId: swatchCardType.id,
        authorId: memberUser.id,
        description: 'Accidentally erased through the paper.'
      }
    ]
  });

  const pigmentOnSwatch = await prisma.pigmentOnSwatch.create({
    data: {
      swatchId: watercolorSwatch.id,
      pigmentId: pigment.id
    }
  });

  const notes = await prisma.note.createMany({
    data: [
      {
        authorId: adminUser.id,
        swatchId: watercolorSwatch.id,
        approved: true,
        content: 'This is a cool comment about this swatch.'
      },
      {
        authorId: memberUser.id,
        swatchId: watercolorSwatch.id,
        approved: true,
        content: 'This is a totally uncool comment about this swatch.'
      }
    ]
  });

  const parentNote = await prisma.note.findFirst({
    where: { authorId: adminUser.id }
  });

  const childNotes = await prisma.note.createMany({
    data: [
      {
        authorId: adminUser.id,
        swatchId: watercolorSwatch.id,
        approved: true,
        content: 'This is a cool reply to this note.',
        noteId: parentNote.id
      },
      {
        authorId: memberUser.id,
        swatchId: watercolorSwatch.id,
        approved: true,
        content: 'This is a totally uncool reply to this note.',
        noteId: parentNote.id
      }
    ]
  });

  const tags = await prisma.tag.createMany({
    data: [
      { label: 'tropical', slug: 'tropical', swatchId: watercolorSwatch.id },
      { label: 'bird feathers', slug: 'bird-feathers', swatchId: watercolorSwatch.id },
      { label: 'nautical', slug: 'nautical', swatchId: watercolorSwatch.id }
    ]
  });

  console.log({
    manufacturer,
    paper,
    paintType,
    colors,
    pigment,
    granulationRatings,
    lightfastRatings,
    transparencyRatings,
    stainingRatings,
    swatchCardTypes,
    adminUser,
    memberUser,
    watercolorSwatch,
    swatchCards,
    pigmentOnSwatch,
    notes,
    childNotes,
    tags,
    swatchCardType
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
