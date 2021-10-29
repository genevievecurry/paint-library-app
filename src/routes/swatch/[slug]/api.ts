import type { Prisma } from "@prisma/client";

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

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

async function send({ method, slug }) {
  let body: Prisma.SwatchSelect;
  let status = 500;

  if (method === 'GET') {
    body = await prisma.swatch.findUnique({
      where: {
        slug,
      },
      select: swatchData,
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
