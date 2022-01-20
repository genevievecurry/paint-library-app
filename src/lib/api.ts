import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import type { Prisma } from '@prisma/client';

import { prisma } from '$lib/prisma';
import { generateSlug, generateUuid} from '$lib/generate';
import bcrypt from 'bcrypt';

const limitedUserSelect: Prisma.UserSelect = {
  username: true,
  role: true,
  status: true,
  uuid: true,
};

const limitedPaintSelect: Prisma.PaintSelect = {
  slug: true,
  uuid: true,
  hex: true,
  name: true,
  manufacturer: {
    select: {
      name: true,
    },
  },
  lightfastRating: {
    select: {
      label: true,
    },
  },
  transparencyRating: {
    select: {
      label: true,
    },
  },
  stainingRating: {
    select: {
      label: true,
    },
  },
  granulationRating: {
    select: {
      label: true,
    },
  },
  pigmentsOnPaints: {
    select: {
      pigment: {
        select: {
          slug: true,
          color: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  },
  swatchCard: {
    take: 1,
    select: {
      imageKitUpload: {
        select: {
          url: true,
          thumbnailUrl: true,
        },
      },
    },
  },
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
        select: limitedPaintSelect,
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
  paperManufacturer: true,
  paperLine: true,
  paperType: true,
  paperWeightInLbs: true,
  author: {
    select: limitedUserSelect,
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
    select: limitedUserSelect,
  },
  paintsInPalette: {
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      order: true,
      paint: {
        select: limitedPaintSelect,
      },
    },
  },
};

const paintSelect: Prisma.PaintSelect = {
  uuid: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: limitedUserSelect,
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
  lightfastRating: true,
  transparencyRating: true,
  stainingRating: true,
  granulationRating: true,
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
          id: true,
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
        select: limitedUserSelect,
      },
      approved: true,
      content: true,
      childNotes: {
        select: {
          createdAt: true,
          updatedAt: true,
          author: {
            select: limitedUserSelect,
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

export async function updatePaint(uuid, data): Promise<{
  body: SwatchCard;
  status: number;
}> {
  let body = null;
  let status = 500;

  const dataQuery = data;

  // Todo: handle these better using Prisma's guidelines for null & undefined values
  if(data.updatePigments){
    dataQuery.pigmentsOnPaints = {
      deleteMany: {},
      createMany: {
        data: data.updatePigments,
      }
    }
    delete data.updatePigments;
  }

  body = await prisma.paint.update({
    where: {
      uuid: uuid,
    },
    data: dataQuery,
  });

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
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
  let orderBy;

  for (const pair of query.entries()) {
    const key = pair[0];
    if(key === 'orderBy') {
      orderBy = JSON.parse(pair[1])
    } else {
      queryArray.push({ [key]: pair[1] });
    }
  }

  if (queryArray.length > 0) {
    body = await prisma[model].findMany({
      where: {
        AND: queryArray,
      },
    });
  } else if (orderBy) {
    body = await prisma[model].findMany({
      orderBy: orderBy
    })
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

  const uuid = generateUuid();

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

export async function getUsers(searchParams) {
  let body = null;
  let status = 500;

  body = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      deleted: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      uuid: true,
      role: true,
      status: true,
      _count: true,
    },
  });

  if (body !== null) {
    status = 200;
  }

  return { body, status };
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
                  swatchCard: {
                    take: 1,
                    select: {
                      imageKitUpload: {
                        select: {
                          url: true,
                          thumbnailUrl: true,
                        },
                      },
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
                select: limitedUserSelect,
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

export async function createPaint(data: ReadOnlyFormData, user): Promise<{
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

  console.log("user", user)
  console.log("data.get('authorUuid')", data.get('authorUuid'))

  const uuid = generateUuid();

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
  let body = null;
  let status = 500;

  const dataQuery = {
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
  };

  if (data.paperLine?.id) {
    dataQuery.paperLine = {
      connect: {
        id: Number(data.paperLine.id),
      },
    };
  }

  if (data.paperManufacturer?.name) {
    dataQuery.paperManufacturer = {
      connect: {
        name: data.paperManufacturer.name,
      },
    };
  }

  if (data.paperType?.id) {
    dataQuery.paperType = {
      connect: {
        id: Number(data.paperType.id),
      },
    };
  }

  if (data.paperWeightInLbs) {
    dataQuery.paperWeightInLbs = Number(data.paperWeightInLbs);
  }

  if (data.swatchCardNamesAdded.length > 0) {
    dataQuery.swatchCardTypesOnSwatchCard = {
      createMany: {
        data: data.swatchCardNamesAdded,
      },
    };
  }

  body = await prisma.swatchCard.create({
    data: dataQuery,
    select: {
      id: true,
    },
  });

  if (body !== null) {
    status = 200;
  }

  return { status, body };
}

export async function updateSwatchCard(data): Promise<{
  body: SwatchCard;
  status: number;
}> {
  let body = null;
  let status = 500;

  const dataQuery = {
    description: data.description,
  };

  // Todo: handle these better using Prisma's guidelines for null & undefined values
  if (data.paperLine?.id) {
    dataQuery.paperLine = {
      connect: {
        id: Number(data.paperLine.id),
      },
    };
  }

  if (data.paperManufacturer?.id) {
    dataQuery.paperManufacturer = {
      connect: {
        id: Number(data.paperManufacturer.id),
      },
    };
  }

  if (data.paperType?.id) {
    dataQuery.paperType = {
      connect: {
        id: Number(data.paperType.id),
      },
    };
  }

  if (data.paperWeightInLbs) {
    dataQuery.paperWeightInLbs = Number(data.paperWeightInLbs);
  }

  // I feel like I'm not reading the Prisma documentation correctly
  // This is wacky
  // Todo: Get smarter & fix
  if (
    data.swatchCardNamesAdded.length > 0 &&
    data.swatchCardNamesRemoved.length > 0
  ) {
    dataQuery.swatchCardTypesOnSwatchCard = {
      createMany: {
        data: data.swatchCardNamesAdded,
      },
      deleteMany: data.swatchCardNamesRemoved,
    };
  } else if (
    data.swatchCardNamesAdded.length > 0 &&
    data.swatchCardNamesRemoved.length === 0
  ) {
    dataQuery.swatchCardTypesOnSwatchCard = {
      createMany: {
        data: data.swatchCardNamesAdded,
      },
    };
  } else if (
    data.swatchCardNamesRemoved.length > 0 &&
    data.swatchCardNamesAdded.length === 0
  ) {
    dataQuery.swatchCardTypesOnSwatchCard = {
      deleteMany: data.swatchCardNamesRemoved,
    };
  }

  body = await prisma.swatchCard.update({
    where: {
      id: data.id,
    },
    data: dataQuery,
  });

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
  };
}

export async function deleteSwatchCard(searchParams) {
  let body = null;
  let status = 500;

  body = await prisma.swatchCard.delete({
    where: {
      id: Number(searchParams.get('id')),
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
  const uuid = generateUuid();

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
        createdAt: 'desc',
      },
      select: {
        _count: true,
        uuid: true,
        visible: true,
        slug: true,
        title: true,
        description: true,
        owner: {
          select: limitedUserSelect,
        },
        paintsInPalette: {
          take: 18,
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            order: true,
            paint: {
              select: limitedPaintSelect,
            },
          },
        },
      },
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
  } else if (data.paletteReorderData) {
    dataQuery = {
      paintsInPalette: {
        update: data.paletteReorderData,
      },
    };
  } else if (data.removePaintInPaletteId) {
    dataQuery = {
      paintsInPalette: {
        delete: [{ id: data.removePaintInPaletteId }],
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
