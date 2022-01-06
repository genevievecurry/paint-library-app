import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import type { Prisma } from '@prisma/client';

import { prisma } from '$lib/prisma';
import { generateSlug, generateUUID } from '$lib/slug';
import bcrypt from 'bcrypt';

const userBasicSelect: Prisma.UserSelect = {
  username: true,
  role: true,
  status: true,
  uuid: true,
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
          uuid: true,
          hex: true,
          name: true,
          manufacturer: {
            select: {
              name: true,
            },
          },
          swatchCard: {
            take: 1,
            select: {
              imageKitUpload: {
                select: {
                  url: true,
                },
              },
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
  swatchCardTypesOnSwatchCard: {
    select: {
      swatchCardType: {
        select: {
          description: true,
          label: true,
          name: true,
        },
      },
    },
  },
  paper: {
    select: {
      manufacturer: {
        select: {
          name: true,
        },
      },
      line: true,
      weightInLbs: true,
      paperType: true,
    },
  },
  author: {
    select: userBasicSelect,
  },
  description: true,
  imageKitUpload: true,
};

const paletteSelect: Prisma.PaletteSelect = {
  _count: true,
  uuid: true,
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
          uuid: true,
          slug: true,
          name: true,
          hex: true,
        },
      },
    },
  },
};

const paintSelect: Prisma.PaintSelect = {
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
  swatchCard: {
    select: swatchCardSelect,
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
  authorUuid: true,
  paintTypeId: true,
  lightfastRatingId: true,
  transparencyRatingId: true,
  stainingRatingId: true,
  granulationRatingId: true,
  manufacturerId: true,
  manufacturerDescription: true,
  communityDescription: true,
  pigmentsOnPaints: true,
  hex: true,
  uuid: true,
  // tags: true,
};

export async function getSearchResults(
  searchQuery: string,
  query,
): Promise<{
  status: number;
  body: SearchResults;
}> {
  const unsluggedQuery = searchQuery.replace('-', ' & ');
  const set = Number(query.get('set'));

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
    skip: set,
    take: set + 50,
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
      swatchCard: {
        take: 1,
        select: {
          imageKitUpload: true,
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

export async function getPaints(query): Promise<{
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
  const set = Number(query.get('set'));

  return {
    status: 200,
    body: await prisma.paint.findMany({
      skip: set,
      take: set + 50,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        uuid: true,
        slug: true,
        hex: true,
        name: true,
        _count: true,
        manufacturer: {
          select: {
            name: true,
          },
        },
        swatchCard: {
          take: 1,
          select: {
            imageKitUpload: true,
          },
        },
      },
    }),
  };
}

// This will return everything in the model that is passed in as an argument
// Intended to be used for form input options
export async function getOption(
  model: string,
  query,
): Promise<{ body: Record<string, unknown>; status: number }> {
  let body;
  let status = 404;
  const queryArray = [];

  for (const pair of query.entries()) {
    const key = pair[0];
    queryArray.push({ [key]: pair[1] });
  }

  if (queryArray.length > 0) {
    body = await prisma[model].findMany({
      where: {
        AND: queryArray,
      },
    });
  } else {
    body = await prisma[model].findMany();
  }

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
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
          uuid: true,
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
        orderBy: {
          setAt: 'desc',
        },
        select: {
          palette: {
            select: {
              uuid: true,
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
      authorUuid: data.get('authorUuid'),
      paintTypeId: Number(data.get('paintTypeId')),
      lightfastRatingId: Number(data.get('lightfastRatingId')),
      transparencyRatingId: Number(data.get('transparencyRatingId')),
      stainingRatingId: Number(data.get('stainingRatingId')),
      granulationRatingId: Number(data.get('granulationRatingId')),
      manufacturerId: Number(data.get('manufacturerId')),
      manufacturerDescription: data.get('manufacturerDescription'),
      communityDescription: data.get('communityDescription'),
      hex: data.get('hex'),
      pigmentsOnPaints: {
        createMany: {
          data: pigments,
        },
      },
    },
    select: createPaintSelect,
  });
  status = 200;

  return {
    status,
    body,
  };
}

export async function createSwatchCard(
  uuid: string,
  data,
): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  const body = await prisma.swatchCard.create({
    data: {
      paint: {
        connect: {
          uuid: uuid,
        },
      },
      author: {
        connect: {
          uuid: data.author.uuid,
        },
      },
      paper: {
        create: {
          line: {
            connect: {
              id: data.paper.lineId,
            },
          },
          manufacturer: {
            connect: {
              name: data.paper.manufacturerName,
            },
          },
          paperType: {
            connect: {
              id: Number(data.paper.paperTypeId),
            },
          },
          weightInLbs: Number(data.paper.weightInLbs),
        },
      },
      swatchCardTypesOnSwatchCard: {
        createMany: {
          data: data.swatchCardNamesFormData,
        },
      },
      description: data.description,
      imageKitUpload: {
        create: {
          fileId: data.imageKitUpload.fileId,
          filePath: data.imageKitUpload.filePath,
          name: data.imageKitUpload.name,
          thumbnailUrl: data.imageKitUpload.thumbnailUrl,
          url: data.imageKitUpload.url,
          height: data.imageKitUpload.height,
          width: data.imageKitUpload.width,
        },
      },
    },
  });

  return { status: 200, body };
}

export async function updateSwatchCard(data: SwatchCard) {
  let body = null;
  let status = 500;

  body = await prisma.swatchCard.update({
    where: {
      id: data.id,
    },
    data: {
      paperId: Number(data.paperId),
      description: data.description,
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
          paintUuid: data.paintUuid,
        },
      },
      owner: {
        connect: {
          uuid: data.owner.uuid,
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

export async function getAllPalettes(): Promise<{
  status: number;
  body: Palette[];
}> {
  return {
    body: await prisma.palette.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      select: paletteSelect,
    }),
    status: 200,
  };
}

export async function getPalette(
  uuid: string,
  user,
): Promise<{ status: number; body: Record<string, unknown> }> {
  let body = null;
  let status = 404;

  body = await prisma.palette.findUnique({
    where: {
      uuid,
    },
    select: paletteSelect,
  });

  if (body) {
    body.savedByUser = false;

    if (user) {
      const savedPalette = await prisma.palette.findFirst({
        where: {
          uuid: uuid,
          AND: [
            {
              savedByUsers: {
                some: {
                  user: {
                    uuid: user.uuid,
                  },
                },
              },
            },
          ],
        },
      });

      body.savedByUser = savedPalette === null ? false : true;
    }

    status = 200;
  }

  return {
    status,
    body,
  };
}

export async function updatePalette(uuid: string, data) {
  let body = null;
  let status = 404;
  let dataQuery;

  if (data.paintUuid) {
    dataQuery = {
      paintsInPalette: {
        create: {
          paint: {
            connect: {
              uuid: data.paintUuid,
            },
          },
        },
      },
    };
  } else if (data.title) {
    dataQuery = {
      title: data.title,
      description: data.description,
      slug: generateSlug({ value: data.title }),
    };
  } else if (data.savedByUser) {
    dataQuery = {
      savedByUsers: {
        create: [{ user: { connect: { uuid: data.savedByUser.uuid } } }],
      },
    };
  } else if (data.unsavedByUser) {
    dataQuery = {
      savedByUsers: {
        deleteMany: [{ userUuid: data.unsavedByUser.uuid }],
      },
    };
  }

  body = await prisma.palette.update({
    where: {
      uuid,
    },
    data: dataQuery,
    select: {
      title: true,
      slug: true,
      uuid: true,
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

export async function deletePalette(uuid) {
  let body = null;
  let status = 500;

  body = await prisma.palette.delete({
    where: {
      uuid,
    },
    select: {
      title: true,
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
