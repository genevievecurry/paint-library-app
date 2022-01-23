require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { parse } = require('csv-parse');
const { createReadStream } = require('fs');
const bcrypt = require('bcrypt');

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
  // CSV Files
  const manufacturerCsv = `${__dirname}/manufacturer.csv`;
  const colorCsv = `${__dirname}/color.csv`;
  const pigmentCsv = `${__dirname}/pigment.csv`;

  // Process CSV files
  const parsedManufacturerCsv = await processFile(manufacturerCsv);
  const parsedColorCsv = await processFile(colorCsv);
  const parsedPigmentCsv = await processFile(pigmentCsv);

  const manufacturerImport = await prisma.manufacturer.createMany({
    data: parsedManufacturerCsv,
    skipDuplicates: true,
  });

  const colorImport = await prisma.color.createMany({
    data: parsedColorCsv,
    skipDuplicates: true,
  });

  const pigmentImport = await prisma.pigment.createMany({
    data: parsedPigmentCsv,
    skipDuplicates: true,
  });

  const paperType = await prisma.paperType.createMany({
    data: [
      { name: 'Unknown' },
      { name: 'Cold Press' },
      { name: 'Hot Press' },
      { name: 'Rough' },
      { name: 'Handmade' },
      { name: 'Yupo' },
      { name: 'Illustration Board' },
      { name: 'Bristol Vellum' },
      { name: 'Bristol Smooth' },
      { name: 'Hardboard' },
    ],
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
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      { code: 'NR', label: 'Not Rated', description: 'Not rated by the ASTM or by blue wool test.'},
      {
        code: 'I',
        label: 'Excellent',
        description:
          'Blue wool 7-8. The pigment will remain unchanged for more than 100 years of light exposure with proper mounting and display. (Suitable for artistic use.)',
      },
      {
        code: 'II',
        label: 'Very Good',
        description:
          'Blue wool 6. The pigment will remain unchanged for 50 to 100 years of light exposure with proper mounting and display. (Suitable for artistic use.)',
      },
      {
        code: 'III',
        label: 'Fair (Impermanent)',
        description:
          'Blue wool 4-5. The pigment will remain unchanged for 15 to 50 years with proper mounting and display. ("May be satisfactory when used full strength or with extra protection from exposure to light.")',
      },
      {
        code: 'IV',
        label: 'Poor (Fugitive)',
        description:
          'Blue wool 2-3. The pigment begins to fade in 2 to 15 years, even with proper mounting and display. (Not suitable for artistic use.)',
      },
      {
        code: 'V',
        label: 'Very Poor (Fugitive)',
        description:
          'Blue wool 1. The pigment begins to fade in 2 years or less of light exposure, even with proper mounting and display. (Not suitable for artistic use.)',
      },
    ],
  });

  const transparencyRatings = await prisma.transparencyRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      { code: 'T', label: 'Transparent', description: 'Transparent' },
      { code: 'S/T', label: 'Semi-Transparent', description: 'Semi-Transparent' },
      { code: 'S/O', label: 'Semi-Opaque', description: 'Semi-Opaque' },
      { code: 'O', label: 'Opaque', description: 'Opaque' },
    ],
  });

  const stainingRatings = await prisma.stainingRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      { code: '1', label: 'Non-Staining', description: 'Liftable or completely removable once dry.' },
      { code: '2', label: 'Low-Staining', description: 'Mostly liftable once dry.' },
      { code: '3', label: 'Medium-Staining', description: 'Partially liftable once dry.' },
      { code: '4', label: 'High-Staining', description: 'Difficult to lift once dry.'},      
    ],
  });

  const granulationRatings = await prisma.granulationRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      { code: 'Y', label: 'Granulating', description: 'Pigment particles are uneven and clearly visible.' },
      { code: 'N', label: 'Non-Granulating', description: 'Pigment particles are smooth and even.' },
    ],
  });

  const salt = bcrypt.genSaltSync(10);
  const superSecurePassword = bcrypt.hashSync('password', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paintlibrary.com' },
    update: {},
    create: {
      email: 'admin@paintlibrary.com',
      firstName: 'Admin',
      lastName: 'Human',
      hashedPassword: superSecurePassword,
      uuid: '37287234987',
      username: 'admin-the-human',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: 'member@paintlibrary.foo' },
    update: {},
    create: {
      email: 'member@paintlibrary.foo',
      firstName: 'Entity',
      lastName: 'Member',
      username: 'entity-member',
      uuid: '372sdf34987',
      hashedPassword: superSecurePassword,
      status: 'ACTIVE',
    },
  });

  const swatchCardTypes = await prisma.swatchCardType.createMany({
    data: [
      {
        label: 'Gradient Wash',
        description: 'More paint to more water.',
        name: 'GRADIENT',
      },
      {
        label: 'Granulation',
        description: 'Particle separation and texture in wet wash.',
        name: 'GRANULATION',
      },
      {
        label: 'Dispersement',
        description: 'Flow of paint on wet paper.',
        name: 'DISPERSEMENT',
      },
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
      {
        label: 'Dry Lift',
        description: 'Dry brush or tissue lifting wet wash',
        name: 'DRY_LIFT',
      },
    ],
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

  console.log({
    manufacturerImport,
    colorImport,
    pigmentImport,
    paperType,
    paintType,
    granulationRatings,
    lightfastRatings,
    transparencyRatings,
    stainingRatings,
    swatchCardTypes,
    adminUser,
    memberUser,
    imageKitUploads,
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
