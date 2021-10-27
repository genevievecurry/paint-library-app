import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const colors = [
    { label: 'Yellow', slug: 'yellow', code: 'Y'},
    { label: 'Orange', slug: 'orange', code: ''},
    { label: 'Red', slug: 'red', code: ''},
    { label: 'Violet', slug: 'violet', code: ''},
    { label: 'Blue', slug: 'blue', code: ''},
    { label: 'Green', slug: 'green', code: ''},
    { label: 'Brown', slug: 'brown', code: ''},
    { label: 'Black', slug: 'black', code: ''},
    { label: 'White', slug: 'white', code: ''},
    { label: 'Metal', slug: 'metal', code: ''}
  ]


  const manufacturer = await prisma.manufacturer.upsert({
    where: { name: 'Daniel Smith'},
    update: {},
    create: {
      name: 'Daniel Smith',
      website: 'https://danielsmith.com/',
    }
  })

  const paper = await prisma.paper.create({
    data: {
      description: 'Cold Press',
      weightInLbs: 140,
      manufacturerId: manufacturer.id,
    }
  })

  const paintType = await prisma.paintType.upsert({
    where: { slug: 'watercolor' },
    update: {},
    create: {
      label: 'Watercolor',
      slug: 'watercolor' 
    }
  })

  const color = await prisma.color.upsert({
    where: { label: 'Yellow' },
    update: {},
    create: {

    }
  })

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
  })

  const memberUser = await prisma.user.upsert({
    where: { email: 'member@paintlibrary.foo' },
    update: {},
    create: {
      email: 'member@paintlibrary.foo',
      displayName: 'Entity Member',
      hashedPassword: 'password',
      status: 'ACTIVE'
    }
  })

  const watercolorSwatch = await prisma.swatch.upsert({
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
      manufacturerPigmentDescription: 'Some pigment | Series 3'
    }
  })

  console.log({ 
    manufacturer,
    paper,
    paintType,
    adminUser,
    memberUser,
    watercolorSwatch
   })
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })