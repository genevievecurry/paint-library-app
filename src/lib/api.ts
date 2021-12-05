import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import type { Prisma } from '@prisma/client';

import { prisma } from '$lib/prisma';

const swatchCardSelect: Prisma.SwatchCardSelect = {
  id: true,
  updatedAt: true,
  swatchCardType: true,
  paper: {
    select: {
      manufacturer: true,
      description: true,
      weightInLbs: true,
    },
  },
  author: true,
  description: true,
  imageKitUpload: true,
};

const paintSelect: Prisma.PaintSelect = {
  id: true,
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
  hex: true,
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
  pigmentsOnPaints: {
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
          imageKitUpload: true,
        },
      },
    },
  },
  swatchCardsOnPaint: {
    select: {
      gradient: { select: swatchCardSelect },
      granulation: { select: swatchCardSelect },
      dispersement: { select: swatchCardSelect },
      highDilution: { select: swatchCardSelect },
      midDilution: { select: swatchCardSelect },
      masstone: { select: swatchCardSelect },
      glaze: { select: swatchCardSelect },
      wetLift: { select: swatchCardSelect },
      dryLift: { select: swatchCardSelect },
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
  // tags: {
  //   select: {
  //     tag: {
  //       select: {
  //         label: true,
  //         slug: true,
  //       },
  //     },
  //   },
  // },
};

const createPaintSelect: Prisma.PaintSelect = {
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
  pigmentsOnPaints: true,
  swatchCardsOnPaint: true,
  hex: true,
  // tags: true,
};

async function updateSwatchCard({
  data,
}): Promise<{ status: number; body: Record<string, unknown> }> {
  const body = await prisma.swatchCard.update({
    where: { id: Number(data.get('id')) },
    data: {
      paper: {
        connect: {
          id: 1,
        },
      },
      description: data.get('description'),
      imageKitUpload: {
        create: {
          fileId: data.get('uploadFileId'),
          filePath: data.get('uploadFilePath'),
          name: data.get('uploadName'),
          thumbnailUrl: data.get('uploadThumbnailUrl'),
          url: data.get('uploadUrl'),
        },
      },
    },
  });

  return { status: 200, body };
}

export async function getResults(query: string): Promise<{
  status: number;
  body: SearchResults;
}> {
  const unsluggedQuery = query.replace('-', ' & ');

  const count = await prisma.paint.count({
    where: {
      productColorName: {
        search: unsluggedQuery,
      },
    },
  });

  const paints = await prisma.paint.findMany({
    where: {
      productColorName: {
        search: unsluggedQuery,
      },
    },
    skip: 0,
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      slug: true,
      hex: true,
      productColorName: true,
      manufacturer: {
        select: {
          name: true,
        },
      },
    },
  });

  const body = {
    count,
    paints,
  };

  return {
    status: 200,
    body: body,
  };
}

export async function getPaints(): Promise<{
  status: number;
  body: {
    slug: string;
    hex: string;
    productColorName: string;
    manufacturer: {
      name: string;
    };
  }[];
}> {
  return {
    status: 200,
    body: await prisma.paint.findMany({
      skip: 0,
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        slug: true,
        hex: true,
        productColorName: true,
        manufacturer: {
          select: {
            name: true,
          },
        },
        // swatchCardsOnPaint: {
        //   include: {
        //     gradient: {
        //       include: {
        //         imageKitUpload: true,
        //       },
        //     },
        //   },
        // },
      },
    }),
  };
}

async function send({
  method,
  slug,
  data,
  model,
}: {
  method: string;
  slug?: string;
  data?: ReadOnlyFormData;
  model?: string;
}) {
  let body = {};
  let status = 500;

  if (method === 'GET' && !model && slug) {
    body = await prisma.paint.findUnique({
      where: {
        slug,
      },
      select: paintSelect,
    });
    status = 200;
  }

  if (method === 'GET' && model) {
    body = await prisma[model].findMany();
    status = 200;
  }

  if (method == 'POST' && data) {
    let pigments = [];
    // const tags = [];

    if (data.getAll('pigments')) {
      pigments = data.getAll('pigments')?.map((pigmentId) => {
        return { pigmentId: Number(pigmentId) };
      });
    }

    // if (data.getAll('tags')) {
    //   tags = data.getAll('tags')?.map((tagId) => {
    //     return { tagId: Number(tagId) };
    //   });
    // }

    body = await prisma.paint.create({
      data: {
        slug: data.get('slug'),
        productColorName: data.get('productColorName'),
        authorId: Number(data.get('authorId')),
        paintTypeId: Number(data.get('paintTypeId')),
        lightfastRatingId: Number(data.get('lightfastRatingId')),
        transparencyRatingId: Number(data.get('transparencyRatingId')),
        stainingRatingId: Number(data.get('stainingRatingId')),
        granulationRatingId: Number(data.get('granulationRatingId')),
        manufacturerId: Number(data.get('manufacturerId')),
        manufacturerDescription: data.get('manufacturerDescription'),
        manufacturerPigmentDescription: data.get('manufacturerPigmentDescription'),
        communityDescription: data.get('communityDescription'),
        hex: data.get('hex'),
        swatchCardsOnPaint: {
          create: {
            gradient: {
              create: {
                swatchCardTypeName: 'GRADIENT',
              },
            },
            granulation: {
              create: {
                swatchCardTypeName: 'GRANULATION',
              },
            },
            dispersement: {
              create: {
                swatchCardTypeName: 'DISPERSEMENT',
              },
            },
            highDilution: {
              create: {
                swatchCardTypeName: 'HIGH_DILUTION',
              },
            },
            midDilution: {
              create: {
                swatchCardTypeName: 'MID_DILUTION',
              },
            },
            masstone: {
              create: {
                swatchCardTypeName: 'MASSTONE',
              },
            },
            glaze: {
              create: {
                swatchCardTypeName: 'GLAZE',
              },
            },
            wetLift: {
              create: {
                swatchCardTypeName: 'WET_LIFT',
              },
            },
            dryLift: {
              create: {
                swatchCardTypeName: 'DRY_LIFT',
              },
            },
          },
        },
        pigmentsOnPaints: {
          createMany: {
            data: pigments,
          },
        },
        // tags: {
        //   createMany: {
        //     data: tags,
        //   },
        // },
      },
      select: createPaintSelect,
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

export function getOption(model: string) {
  return send({ method: 'GET', model });
}

export function edit(data) {
  return updateSwatchCard({ data });
}
