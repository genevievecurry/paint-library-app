import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import type { Prisma } from '@prisma/client';

import { prisma } from '$lib/prisma';
import { generateSlug, generateUUID } from '$lib/slug';
import bcrypt from 'bcrypt';

const userBasicSelect: Prisma.UserSelect = {
  username: true,
  role: true,
  status: true,
};

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
          name: true,
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
  author: {
    select: userBasicSelect,
  },
  description: true,
  imageKitUpload: true,
};

const paletteSelect: Prisma.PaletteSelect = {
  id: true,
  visible: true,
  slug: true,
  title: true,
  description: true,
  owner: {
    select: userBasicSelect,
  },
  paintsInPalette: {
    select: {
      order: true,
      paint: {
        select: {
          slug: true,
          name: true,
          hex: true,
        },
      },
    },
  },
};

const paintSelect: Prisma.PaintSelect = {
  id: true,
  uuid: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: userBasicSelect,
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
  name: true,
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
      author: {
        select: userBasicSelect,
      },
      approved: true,
      content: true,
      childNotes: {
        select: {
          createdAt: true,
          updatedAt: true,
          author: {
            select: userBasicSelect,
          },
          approved: true,
          content: true,
        },
      },
    },
  },
  _count: true,
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
  name: true,
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
  uuid: true,
  // tags: true,
};

export async function getSearchResults(query: string): Promise<{
  status: number;
  body: SearchResults;
}> {
  const unsluggedQuery = query.replace('-', ' & ');

  const count = await prisma.paint.count({
    where: {
      name: {
        search: unsluggedQuery,
      },
    },
  });

  const paints = await prisma.paint.findMany({
    where: {
      name: {
        search: unsluggedQuery,
      },
    },
    skip: 0,
    take: 100,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      uuid: true,
      slug: true,
      hex: true,
      name: true,
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

export async function getAllPigments(): Promise<{
  status: number;
  body: PigmentListingByColor[];
}> {
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

export async function getPigmentsByColor(slug: string): Promise<{
  status: number;
  body: {
    currentColor: string;
    pigments: ListPigment[];
  };
}> {
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

export async function getPaint(
  uuid: string,
  user,
): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = null;
  let status = 404;

  const paint = await prisma.paint.findUnique({
    where: {
      uuid,
    },
    select: paintSelect,
  });

  if (paint !== null) {
    status = 200;
    body = paint;
  }

  return {
    status,
    body,
  };
}

export async function getPaints(): Promise<{
  status: number;
  body: {
    uuid: string;
    slug: string;
    hex: string;
    name: string;
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
        uuid: true,
        slug: true,
        hex: true,
        name: true,
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

// This will return everything in the model that is passed in as an argument
// Intended to be used for form input options
export async function getOption(
  model: string,
): Promise<{ body: Record<string, unknown>; status: number }> {
  return {
    body: await prisma[model].findMany(),
    status: 200,
  };
}

export async function createUser(data: {
  password: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}): Promise<{ body: null | User; status: number }> {
  let body = null;
  let status = 404;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(data.password, salt);

  const uuid = generateUUID();

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      hashedPassword,
      uuid: uuid,
    },
    select: {
      username: true,
      email: true,
      role: true,
      status: true,
      firstName: true,
      lastName: true,
      uuid: true,
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

export async function updateUser(
  data: User,
  user: User,
): Promise<{
  body: User | null;
  status: number;
}> {
  let body = null;
  let status = 404;


  const response = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
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

export async function getUser(data: {
  password: string;
  email: string;
}): Promise<{
  body: User | null;
  status: number;
}> {
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
        uuid: true,
        firstName: true,
        username: true,
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

export async function getUserProfile(data): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;

  const response = await prisma.user.findUnique({
    where: {
      username: data,
    },
    select: {
      uuid: true,
      username: true,
      _count: true,
    },
  });

  if (response !== null) {
    body = response;
    status = 200;
  }

  return {
    status,
    body,
  };
}

export async function getUserProfileOwnedPalettes(data): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;

  const response = await prisma.user.findUnique({
    where: {
      username: data,
    },
    select: {
      uuid: true,
      username: true,
      ownedPalettes: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          slug: true,
          title: true,
          description: true,
          _count: true,
          paintsInPalette: {
            select: {
              paint: {
                select: {
                  name: true,
                  uuid: true,
                  slug: true,
                  hex: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (response !== null) {
    body = response;
    status = 200;
  }

  return {
    status,
    body,
  };
}

export async function getUserProfileSavedPalettes(data): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;

  const response = await prisma.user.findUnique({
    where: {
      username: data,
    },
    select: {
      uuid: true,
      username: true,
      savedPalettes: {
        select: {
          palette: {
            select: {
              slug: true,
              title: true,
              description: true,
              owner: {
                select: userBasicSelect,
              },
              _count: true,
              paintsInPalette: {
                select: {
                  order: true,
                  paint: {
                    select: {
                      hex: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (response !== null) {
    body = response;
    status = 200;
  }

  return {
    status,
    body,
  };
}

export async function createPaint(data: ReadOnlyFormData): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;
  let pigments = [];
  // const tags = [];

  if (data.getAll('pigments')) {
    pigments = data.getAll('pigments')?.map((pigmentId) => {
      return { pigmentId: Number(pigmentId) };
    });
  }

  const uuid = generateUUID();

  // if (data.getAll('tags')) {
  //   tags = data.getAll('tags')?.map((tagId) => {
  //     return { tagId: Number(tagId) };
  //   });
  // }

  body = await prisma.paint.create({
    data: {
      uuid: uuid,
      slug: data.get('slug'),
      name: data.get('name'),
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

export async function updateSwatchCard(data: ReadOnlyFormData): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
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

export async function createPalette(data): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = null;
  let status = 404;

  const slug = generateSlug({ value: data.title, uuid: false });
  const uuid = generateUUID();

  const palette = await prisma.palette.create({
    data: {
      uuid: uuid,
      slug: slug,
      title: data.title,
      description: data.description,
      paintsInPalette: {
        create: {
          paintId: data.paintId,
        },
      },
      owner: {
        connect: {
          slug: data.owner.slug,
        },
      },
    },
  });

  if (palette !== null) {
    body = palette;
    status = 200;
  }

  return {
    body,
    status,
  };
}

export async function getPalette(
  slug: string,
): Promise<{ status: number; body: Record<string, unknown> }> {
  let body = null;
  let status = 404;

  body = await prisma.palette.findUnique({
    where: {
      slug,
    },
    select: paletteSelect,
  });

  if (body) {
    status = 200;
  }

  return {
    status,
    body,
  };
}

export async function updatePalette(slug, data, user) {
  let body = null;
  let status = 404;
  let dataQuery;

  if (data.paintId){
    dataQuery = {
      paintsInPalette: {
        create: {
          paint: {
            connect: {
              id: data.paintId,
            },
          },
        },
      },
    }
  } else {
    dataQuery = {
      title: data.title,
      description: data.description,
      slug: generateSlug({value: data.title})
    }
  }

  body = await prisma.palette.update({
    where: {
      slug: slug,
    },
    data: dataQuery,
    select: {
      title: true,
      slug: true,
    },
  });

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
  };
}

export async function deletePalette(slug) {
  let body = null;
  let status = 500;

  body = await prisma.palette.delete({
    where: {
      slug: slug,
    },
    select: {
      title: true,
    }
  })

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
  };
}