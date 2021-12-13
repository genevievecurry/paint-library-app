import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import type { Prisma } from '@prisma/client';

import { prisma } from '$lib/prisma';
import { generateSlug } from '$lib/slug';
import bcrypt from 'bcrypt';

const pigmentSelect: Prisma.PigmentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  type: true,
  name: true,
  number: true,
  hex: true,
  color: {
    select: {
      code: true,
      label: true,
      slug: true,
    },
  },
  imageKitUpload: true,
  paints: {
    select: {
      paint: {
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
      },
    },
  },
  slug: true,
};

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
          hex: true,
          slug: true,
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

export async function getSearchResults(query: string): Promise<{
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

export async function getPigment(slug: string) {
  return {
    status: 200,
    body: await prisma.pigment.findUnique({
      where: {
        slug,
      },
      select: pigmentSelect,
    }),
  };
}

export async function getAllPigments() {
  return {
    body: await prisma.color.findMany({
      orderBy: {
        label: 'asc',
      },
      select: {
        label: true,
        slug: true,
        pigments: {
          select: {
            slug: true,
            hex: true,
            name: true,
            number: true,
          },
        },
      },
    }),
    status: 200,
  };
}

export async function getPigmentsByColor(slug: string) {
  const currentColor = await prisma.color.findUnique({
    where: {
      slug,
    },
  });

  const pigments = await prisma.pigment.findMany({
    where: {
      colorCode: currentColor.code,
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      slug: true,
      hex: true,
      name: true,
    },
  });

  const body = {
    currentColor: currentColor.label,
    pigments,
  };

  return {
    status: 200,
    body,
  };
}

export async function getPaint(slug: string) {
  return {
    body: await prisma.paint.findUnique({
      where: {
        slug,
      },
      select: paintSelect,
    }),
    status: 200,
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

// This will return everythin in the model that is passed in as an argument
// Intended to be used for form input options
export async function getOption(model: string) {
  return {
    body: await prisma[model].findMany(),
    status: 200,
  };
}

export async function createUser(data) {
  let body = null;
  let status = 404;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(data.password, salt);

  const slug = generateSlug({ value: data.displayName, uuid: true });

  const user = await prisma.user.create({
    data: {
      email: data.email,
      displayName: data.displayName,
      hashedPassword,
      slug,
    },
    select: {
      displayName: true,
      email: true,
      role: true,
      status: true,
      slug: true,
    },
  });

  if (user !== null) {
    body = user;
    status = 200;
  }

  return {
    body,
    status,
  };
}

export async function updateUser(data, user) {
  let body = null;
  let status = 401;

  const response = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      displayName: data.displayName,
    },
    select: {
      slug: true,
      displayName: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (response !== null) {
    body = response;
    status = 200;
  }

  return {
    body,
    status,
  };
}

export async function getUser(data) {
  let body = null;
  let status = 404;

  const { hashedPassword } = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      hashedPassword: true,
    },
  });

  const match = await bcrypt.compare(data.password, hashedPassword);

  if (match) {
    const response = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        slug: true,
        displayName: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (response !== null) {
      body = response;
      status = 200;
    }
  }

  return {
    body,
    status,
  };
}

export async function createPaint(data: ReadOnlyFormData) {
  let body = {};
  let status = 500;
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
      manufacturerPigmentDescription: data.get(
        'manufacturerPigmentDescription',
      ),
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

  return {
    status,
    body,
  };
}

export async function updateSwatchCard({
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
