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
      cast: (value, _context) => {
        // Fix CSV values for Prisma
        if (value === 'true' || value === 'TRUE') return true;
        if (value === '') return undefined;
        return value;
      },
    }),
  );

  for await (const record of parser) {
    if (record.number) {
      record.number = Number(record.number);
    }
    records.push(record);
  }
  return records;
};

async function main() {
  // CSV Files
  const manufacturerCsv = `${__dirname}/manufacturer.csv`;
  const colorCsv = `${__dirname}/color.csv`;
  const lineCsv = `${__dirname}/line.csv`;
  const yellowPigmentCsv = `${__dirname}/yellow-pigments.csv`;
  const orangePigmentCsv = `${__dirname}/orange-pigments.csv`;
  const redPigmentCsv = `${__dirname}/red-pigments.csv`;
  const violetPigmentCsv = `${__dirname}/violet-pigments.csv`;
  const bluePigmentCsv = `${__dirname}/blue-pigments.csv`;
  const greenPigmentCsv = `${__dirname}/green-pigments.csv`;
  const brownPigmentCsv = `${__dirname}/brown-pigments.csv`;
  const blackPigmentCsv = `${__dirname}/black-pigments.csv`;
  const whitePigmentCsv = `${__dirname}/white-pigments.csv`;
  const additionalPigmentCsv = `${__dirname}/additional-pigments.csv`;

  // Process CSV files
  const parsedManufacturerCsv = await processFile(manufacturerCsv);
  const parsedColorCsv = await processFile(colorCsv);
  const parsedLineCsv = await processFile(lineCsv);
  const parsedYellowPigmentCsv = await processFile(yellowPigmentCsv);
  const parsedOrangePigmentCsv = await processFile(orangePigmentCsv);
  const parsedRedPigmentCsv = await processFile(redPigmentCsv);
  const parsedVioletPigmentCsv = await processFile(violetPigmentCsv);
  const parsedBluePigmentCsv = await processFile(bluePigmentCsv);
  const parsedGreenPigmentCsv = await processFile(greenPigmentCsv);
  const parsedBrownPigmentCsv = await processFile(brownPigmentCsv);
  const parsedBlackPigmentCsv = await processFile(blackPigmentCsv);
  const parsedWhitePigmentCsv = await processFile(whitePigmentCsv);
  const parsedAdditionalPigmentCsv = await processFile(additionalPigmentCsv);

  const manufacturerImport = await prisma.manufacturer.createMany({
    data: parsedManufacturerCsv,
    skipDuplicates: true,
  });

  console.log('ManufacturerImport', manufacturerImport);

  if (manufacturerImport.count) {
    const lineImport = parsedLineCsv.forEach(async (line) => {
      let lineItem = await prisma.line.upsert({
        where: {
          manufacturerName_name: {
            name: line.name,
            manufacturerName: line.manufacturerName,
          },
        },
        update: {
          name: line.name,
        },
        create: {
          name: line.name,
          manufacturer: {
            connectOrCreate: {
              create: {
                name: line.manufacturerName,
              },
              where: {
                name: line.manufacturerName,
              },
            },
          },
        },
      });
    });
    console.log('LineImport', lineImport);
  }

  const colorImport = await prisma.color.createMany({
    data: parsedColorCsv,
    skipDuplicates: true,
  });

  console.log('ColorImport', colorImport);

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

  console.log('PaperType', paperType);

  const paintType = await prisma.paintType.upsert({
    where: { slug: 'watercolor' },
    update: {},
    create: {
      label: 'Watercolor',
      slug: 'watercolor',
    },
  });

  console.log('PaintType', paintType);

  const lightfastRatings = await prisma.lightfastRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      {
        code: 'NR',
        label: 'Not Rated',
        description: 'Not rated by the ASTM or by blue wool test.',
      },
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

  console.log('lightfastRatings', lightfastRatings);

  const transparencyRatings = await prisma.transparencyRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      { code: 'T', label: 'Transparent', description: 'Transparent' },
      {
        code: 'S/T',
        label: 'Semi-Transparent',
        description: 'Semi-Transparent',
      },
      { code: 'S/O', label: 'Semi-Opaque', description: 'Semi-Opaque' },
      { code: 'O', label: 'Opaque', description: 'Opaque' },
    ],
  });

  console.log('transparencyRatings', transparencyRatings);

  const stainingRatings = await prisma.stainingRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      {
        code: '1',
        label: 'Non-Staining',
        description: 'Liftable or completely removable once dry.',
      },
      {
        code: '2',
        label: 'Low-Staining',
        description: 'Mostly liftable once dry.',
      },
      {
        code: '3',
        label: 'Medium-Staining',
        description: 'Partially liftable once dry.',
      },
      {
        code: '4',
        label: 'High-Staining',
        description: 'Difficult to lift once dry.',
      },
    ],
  });

  console.log('stainingRatings', stainingRatings);

  const granulationRatings = await prisma.granulationRating.createMany({
    data: [
      { code: 'X', label: 'Unknown', description: 'No data available.' },
      {
        code: 'Y',
        label: 'Granulating',
        description: 'Pigment particles are uneven and clearly visible.',
      },
      {
        code: 'N',
        label: 'Non-Granulating',
        description: 'Pigment particles are smooth and even.',
      },
    ],
  });

  console.log('granulationRatings', granulationRatings);

  const salt = bcrypt.genSaltSync(10);
  const superSecurePassword = bcrypt.hashSync('password', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@paintlibrary.art' },
    update: {},
    create: {
      email: 'admin@paintlibrary.art',
      firstName: 'Admin',
      lastName: 'Human',
      hashedPassword: superSecurePassword,
      uuid: '37287234987',
      username: 'admin',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: 'member@paintlibrary.art' },
    update: {},
    create: {
      email: 'member@paintlibrary.art',
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

  if (
    colorImport.count &&
    lightfastRatings.count &&
    transparencyRatings.count
  ) {
    const yellowPigmentImport = parsedYellowPigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const orangePigmentImport = parsedOrangePigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const redPigmentImport = parsedRedPigmentCsv.forEach(async (pigment, i) => {
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
    });

    const violetPigmentImport = parsedVioletPigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const bluePigmentImport = parsedBluePigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const greenPigmentImport = parsedGreenPigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const brownPigmentImport = parsedBrownPigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const blackPigmentImport = parsedBlackPigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const whitePigmentImport = parsedWhitePigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );

    const additionalPigmentImport = parsedAdditionalPigmentCsv.forEach(
      async (pigment, i) => {
        const pigments = await prisma.pigment.upsert({
          where: { slug: pigment.slug },
          update: pigment,
          create: pigment,
        });
      },
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
