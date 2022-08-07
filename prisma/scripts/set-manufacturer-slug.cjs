const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['info', 'warn'] });

async function main() {
  const slug = (value) => {
    return value
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const manufacturers = await prisma.manufacturer.findMany();

  if (manufacturers) {
    const results = await Promise.all(
      manufacturers.map(async (manufacturer) => {
        return await prisma.manufacturer.update({
          where: {
            id: manufacturer.id,
          },
          data: {
            slug: slug(manufacturer.name),
          },
        });
      }),
    );
    console.log(results);
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
