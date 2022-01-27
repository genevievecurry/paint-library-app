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
    record.number = Number(record.number);
    records.push(record);
  }
  return records;
};

async function main() {
  // CSV Files
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

  const yellowPigmentImport = parsedYellowPigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const orangePigmentImport = parsedOrangePigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('orangePigmentImport index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const redPigmentImport = parsedRedPigmentCsv.forEach(async (pigment, i) => {
    console.log('=========');
    const pigments = await prisma.pigment.upsert({
      where: { slug: pigment.slug },
      update: pigment,
      create: pigment,
    });
    console.log('redPigmentImport index:', i);
    console.log(pigment.name);
    console.log(pigment.lightfastRatingCode);

    console.log('=========');
  });

  const violetPigmentImport = parsedVioletPigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('violetPigmentImport index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const bluePigmentImport = parsedBluePigmentCsv.forEach(async (pigment, i) => {
    console.log('=========');
    const pigments = await prisma.pigment.upsert({
      where: { slug: pigment.slug },
      update: pigment,
      create: pigment,
    });
    console.log('bluePigmentImport index:', i);
    console.log(pigment.name);
    console.log(pigment.lightfastRatingCode);

    console.log('=========');
  });

  const greenPigmentImport = parsedGreenPigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('greenPigmentImport index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const brownPigmentImport = parsedBrownPigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('brownPigmentImport index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const blackPigmentImport = parsedBlackPigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('blackPigmentImport index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const whitePigmentImport = parsedWhitePigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('whitePigmentImport index:', i);
      console.log(pigment.name);
      console.log(pigment.lightfastRatingCode);

      console.log('=========');
    },
  );

  const additionalPigmentImport = parsedAdditionalPigmentCsv.forEach(
    async (pigment, i) => {
      console.log('=========');
      const pigments = await prisma.pigment.upsert({
        where: { slug: pigment.slug },
        update: pigment,
        create: pigment,
      });
      console.log('additionalPigmentImport index:', i);
      console.log(pigment.name);
      console.log('colorCode', pigment.colorCode);

      console.log('=========');
    },
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
