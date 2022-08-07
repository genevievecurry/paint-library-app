const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['info', 'warn'] });

async function getPigmentsOnPaints(){
  let body = null;
  let status = 500;

  body = await prisma.$queryRawUnsafe('SELECT "PigmentsOnPaints"."id" FROM (SELECT MIN("PigmentsOnPaints"."id") as id, "PigmentsOnPaints"."paintId", "PigmentsOnPaints"."pigmentId" FROM "PigmentsOnPaints" GROUP BY "PigmentsOnPaints"."paintId", "PigmentsOnPaints"."pigmentId") duplicates JOIN "PigmentsOnPaints" on "PigmentsOnPaints"."paintId" = duplicates."paintId" and "PigmentsOnPaints"."pigmentId" = duplicates."pigmentId" and "PigmentsOnPaints"."id" <> duplicates.id')

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
  };
}

async function main() {
  const pop = await getPigmentsOnPaints();

  if (pop.status == 200) {
    const popIdsToDelete = pop.body.map(item => item.id);
    console.log(`deleting the following ${popIdsToDelete.length} pigmentsOnPaints ids:`)
    console.log(popIdsToDelete)
    const results = await prisma.pigmentsOnPaints.deleteMany({
      where: {
        id: {
          in: popIdsToDelete
        }
      }
    })

    console.log("Results:", results)
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