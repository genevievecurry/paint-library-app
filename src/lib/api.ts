import { Prisma, PrismaClient } from '@prisma/client';

// import type { Prisma } from "@prisma/client";

// import pkg from '@prisma/client';
// const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const swatchData: Prisma.SwatchSelect = {
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      displayName: true,
      role: true,
      status: true,
    },
  },
  slug: true,
  manufacturer: {
    select: {
      name: true,
      website: true,
    },
  },
  paintType: {
    select: {
      label: true,
      slug: true,
    },
  },
  productUrl: true,
  productColorName: true,
  communityDescription: true,
  manufacturerDescription: true,
  manufacturerPigmentDescription: true,
  lightfastRating: {
    select: {
      label: true,
      description: true,
    },
  },
  transparencyRating: {
    select: {
      label: true,
      description: true,
    },
  },
  stainingRating: {
    select: {
      label: true,
      description: true,
    },
  },
  granulationRating: {
    select: {
      label: true,
      description: true,
    },
  },
  pigments: {
    select: {
      pigment: {
        select: {
          color: {
            select: {
              code: true,
              label: true,
              slug: true,
            },
          },
          name: true,
          number: true,
          type: true,
        },
      },
    },
  },
  swatchCards: {
    select: {
      createdAt: true,
      updatedAt: true,
      paper: {
        select: {
          manufacturer: true,
          description: true,
          weightInLbs: true,
        },
      },
      swatchCardType: true,
      author: true,
      description: true,
    },
  },
  notes: {
    where: {
      noteId: {
        equals: null,
      },
    },
    select: {
      createdAt: true,
      updatedAt: true,
      author: true,
      approved: true,
      content: true,
      childNotes: {
        select: {
          createdAt: true,
          updatedAt: true,
          author: true,
          approved: true,
          content: true,
        },
      },
    },
  },
  tags: {
    select: {
      label: true,
      slug: true,
    },
  },
};

const newSwatch: Prisma.SwatchSelect = {
  slug: true,
  productColorName: true,
  authorId: true,
  paintTypeId: true,
  lightfastRatingId: true,
  transparencyRatingId: true,
  stainingRatingId: true,
  granulationRatingId: true,
  manufacturerId: true,
  manufacturerDescription: true,
  manufacturerPigmentDescription: true,
  communityDescription: true,
};

export async function getSwatches() {
  return {
    status: 200,
    body: await prisma.swatch.findMany()
  }
}

async function send({
  method,
  slug,
  data,
  model,
}: {
  method: string;
  slug?: string;
  data?: Record<string, unknown>;
  model?: string;
}) {
  let body = {};
  let status = 500;

  if (method === 'GET' && !model) {
    body = await prisma.swatch.findUnique({
      where: {
        slug,
      },
      select: swatchData,
    });
    status = 200;
  }

  if (method === 'GET' && model) {
    body = await prisma[model].findMany();
    status = 200;
  }

  if (method == 'POST') {
    body = await prisma.swatch.create({
      data: {
        slug: data.swatch.slug,
        productColorName: data.swatch.productColorName,
        authorId: data.swatch.authorId,
        paintTypeId: data.swatch.paintTypeId,
        lightfastRatingId: data.swatch.lightfastRatingId,
        transparencyRatingId: data.swatch.transparencyRatingId,
        stainingRatingId: data.swatch.stainingRatingId,
        granulationRatingId: data.swatch.granulationRatingId,
        manufacturerId: data.swatch.manufacturerId,
        manufacturerDescription: data.swatch.manufacturerDescription,
        manufacturerPigmentDescription: data.swatch.manufacturerPigmentDescription,
        communityDescription: data.swatch.communityDescription,
      },
      select: newSwatch
    });
    status = 200;
  }

  return {
    status,
    body,
  };
}

export function get(slug: string) {
  return send({ method: 'GET', slug });
}

export function post(data) {
  return send({ method: 'POST', data });
}

export function getOption(model) {
  return send({ method: 'GET', model });
}
