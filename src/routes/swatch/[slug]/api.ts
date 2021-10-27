import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type SwatchData = {
  id: number
  createdAt: Date
  updatedAt: Date
  deleted: boolean
  published: boolean
  authorId: number
  slug: string
  manufacturerId: number | null
  paintTypeId: number
  productUrl: string | null
  productColorName: string
  communityDescription: string | null
  manufacturerDescription: string | null
  manufacturerPigmentDescription: string | null
}

async function send({ method, slug}) {
  let body = {};
  let status = 500;

  if(method === 'GET') {
    body = await prisma.swatch.findUnique({
      where: {
        slug
      }
    })
    status = 200;
  }

  return {
    status,
    body
  }
}

export function get(slug: string) {
  return send({ method: 'GET', slug})
}
