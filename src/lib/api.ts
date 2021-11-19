
import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';

// Comment in this line for local development
import { Prisma, PrismaClient } from '@prisma/client';

// Comment in these lines to deploy & build on heroku... 
// Todo: Cry 
// import type { Prisma } from "@prisma/client";

// import pkg from '@prisma/client';
// const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const swatchCardSelect: Prisma.SwatchCardSelect = {
  createdAt: true,
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
}

const swatchSelect: Prisma.SwatchSelect = {
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
          imageKitUpload: true,
        },
      },
    },
  },
  swatchCardsOnSwatch: {
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
    }
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

const createSwatchSelect: Prisma.SwatchSelect = {
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
  pigments: true,
  swatchCardsOnSwatch: true
  // tags: true,
};

export async function getSwatches() {
  return {
    status: 200,
    body: await prisma.swatch.findMany(),
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
    body = await prisma.swatch.findUnique({
      where: {
        slug,
      },
      select: swatchSelect,
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

    const imageKitUpload = await prisma.imageKitUpload.create({
      data: {
        fileId: data.get('uploadFileId'),
        filePath: data.get('uploadFilePath'),
        name: data.get('uploadName'),
        thumbnailUrl: data.get('uploadThumbnailUrl'),
        url: data.get('uploadUrl'),
      }
    })

    body = await prisma.swatch.create({
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
        swatchCardsOnSwatch: {
          create: {
            gradient: {
              create: {
                paperId: Number(data.get('paperId')),
                swatchCardTypeName: 'GRADIENT',
                authorId: Number(data.get('authorId')),
                description: data.get('swatchCardDescription'),
                imageKitUploadId: imageKitUpload.id,
              }
            }
          }
        },
        pigments: {
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
      select: createSwatchSelect,
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
