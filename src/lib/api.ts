import type { Note, Prisma } from '@prisma/client';

import { prisma } from '$lib/prisma';
import { generateSlug, generateUuid } from '$lib/generate';
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
  published: true,
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
  alternateNames: true,
  toxicity: true,
  reviewed: true,
  description: true,
  notes: true,
  lightfastRatingCode: true,
  lightfastRating: true,
  ciConstitutionNumber: true,
  composition: true,
  transparencyRatingCode: true,
  transparencyRating: true,
  colorCode: true,
  color: {
    select: {
      code: true,
      label: true,
      slug: true,
      hex: true,
    },
  },
  imageKitUploadId: true,
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
  createdAt: true,
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
  paint: {
    select: {
      slug: true,
      uuid: true,
      name: true,
      manufacturer: {
        select: {
          name: true,
        },
      },
    },
  },
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
  published: true,
  author: {
    select: limitedUserSelect,
  },
  slug: true,
  line: true,
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
              hex: true,
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
    // Comment in if we allow replies
    // where: {
    //   noteId: {
    //     equals: null,
    //   },
    // },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
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
  published: true,
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
      AND: [
        {
          published: true,
        },
      ],
    },
  });

  const paints = await prisma.paint.findMany({
    where: {
      name: {
        search: unsluggedQuery,
      },
      AND: [
        {
          published: true,
        },
      ],
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

export async function upsertPigment(data) {
  let body = null;
  let status = 500;

  body = await prisma.pigment.upsert({
    where: {
      id: data.id ? data.id : undefined,
      slug: data.id ? undefined : data.slug,
    },
    update: data,
    create: data,
    select: {
      id: true,
      name: true,
      slug: true,
      color: {
        select: {
          slug: true,
        },
      },
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

export async function getAllPigments(searchParams = null): Promise<{
  status: number;
  body: PigmentListingByColor[];
}> {
  let whereQuery;

  if (searchParams?.has('query')) {
    whereQuery = {
      slug: {
        search: searchParams.get('query'),
      },
      name: {
        search: searchParams.get('query'),
      },
    };
  }

  return {
    body: await prisma.pigment.findMany({
      where: whereQuery,
      orderBy: {
        colorCode: 'asc',
      },
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
        description: true,
        reviewed: true,
        colorCode: true,
        color: {
          select: {
            label: true,
            slug: true,
            hex: true,
          },
        },
        slug: true,
        hex: true,
        name: true,
        number: true,
        _count: true,
      },
    }),
    status: 200,
  };
}

export async function getAllPigmentsByColor(): Promise<{
  status: number;
  body: PigmentListingByColor[];
}> {
  return {
    body: await prisma.color.findMany({
      orderBy: {
        label: 'asc',
      },
      select: {
        _count: true,
        label: true,
        slug: true,
        hex: true,
        pigments: {
          orderBy: {
            number: 'asc',
          },
          select: {
            slug: true,
            hex: true,
            name: true,
            number: true,
            type: true,
            colorCode: true,
            lightfastRating: true,
            transparencyRating: true,
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
      number: 'asc',
    },
    select: {
      slug: true,
      hex: true,
      name: true,
      type: true,
      number: true,
      colorCode: true,
      color: {
        select: {
          hex: true,
        },
      },
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
  const set = query.get('set') ? Number(query.get('set')) : 0;
  const take = query.get('take') ? Number(query.get('take')) : 50;
  const showAll = JSON.parse(query.get('all')) ? undefined : true;

  return {
    status: 200,
    body: await prisma.paint.findMany({
      skip: set,
      take: take + set,
      where: {
        published: showAll,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
        updatedAt: true,
        id: true,
        published: true,
        uuid: true,
        slug: true,
        hex: true,
        name: true,
        _count: true,
        line: {
          select: {
            name: true,
          },
        },
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

export async function updatePaint(
  uuid: string,
  data,
): Promise<{
  body: SwatchCard;
  status: number;
}> {
  let body = null;
  let status = 500;

  const dataQuery = data;

  // Todo: handle these better using Prisma's guidelines for null & undefined values
  if (data.updatePigments) {
    dataQuery.pigmentsOnPaints = {
      deleteMany: {},
      createMany: {
        data: data.updatePigments,
      },
    };
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

export async function createNote(data, uuid, user) {
  let body = null;
  let status = 404;
  let noteConnect;

  if (data.parentNoteId) {
    noteConnect = { connect: { id: data.parentNoteId } };
  }

  body = await prisma.note.create({
    data: {
      author: {
        connect: {
          uuid: user.uuid,
        },
      },
      paint: {
        connect: {
          uuid: uuid,
        },
      },
      content: data.content,
      note: noteConnect,
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

export async function updateNote(data): Promise<{
  body: Note;
  status: number;
}> {
  let body = null;
  let status = 500;

  body = await prisma.note.update({
    where: {
      id: data.id,
    },
    data: {
      approved: data.approved,
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

export async function deleteNote(data) {
  let body = null;
  let status = 500;

  body = await prisma.note.delete({
    where: {
      id: data,
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

export async function getAllNotes(searchParams) {
  let whereQuery;
  const queryArray = [];

  for (const pair of searchParams.entries()) {
    const key = pair[0];
    let value = pair[1];

    if (value === 'true' || value === 'false') {
      value = JSON.parse(pair[1]);
    }

    queryArray.push({ [key]: value });
  }

  if (queryArray.length > 0) {
    whereQuery = {
      AND: queryArray,
    };
  }

  return {
    body: await prisma.note.findMany({
      where: whereQuery,
      select: {
        id: true,
        author: { select: limitedUserSelect },
        paint: {
          select: {
            uuid: true,
            slug: true,
            name: true,
          },
        },
        approved: true,
        content: true,
        createdAt: true,
      },
    }),
    status: 200,
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
    let value = decodeURIComponent(pair[1]);
    if (key === 'orderBy') {
      orderBy = { [value]: 'asc' };
    } else {
      if (value === 'true' || value === 'false') {
        value = JSON.parse(pair[1]);
      }
      queryArray.push({ [key]: value });
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
      orderBy,
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
  data,
  user: User,
): Promise<{
  body: User | null;
  status: number;
}> {
  let body = null;
  let status = 400;
  let hashedNewPassword;

  if (data.currentPassword && data.newPassword) {
    if (data.currentPassword.length > 0 && data.newPassword.length > 0) {
      const { hashedPassword } = await prisma.user.findUnique({
        where: {
          uuid: user.uuid,
        },
        select: {
          hashedPassword: true,
        },
      });

      const match = await bcrypt.compare(data.currentPassword, hashedPassword);

      if (match) {
        const salt = bcrypt.genSaltSync(10);
        hashedNewPassword = bcrypt.hashSync(data.newPassword, salt);
      } else {
        return {
          body,
          status,
        };
      }
    }
  }

  const response = await prisma.user.update({
    where: {
      uuid: user.uuid,
    },
    data: {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      hashedPassword: hashedNewPassword,
      status: data.status,
      role: data.role,
    },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      status: true,
      uuid: true,
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

export async function deleteUser(uuid) {
  let body = null;
  let status = 500;

  body = await prisma.user.delete({
    where: {
      uuid,
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

export async function getUsers(searchParams) {
  let body = null;
  let status = 500;

  let whereQuery;
  const queryArray = [];

  for (const pair of searchParams.entries()) {
    const key = pair[0];
    let value = pair[1];

    if (value === 'true' || value === 'false') {
      value = JSON.parse(pair[1]);
    }

    queryArray.push({ [key]: value });
  }

  if (queryArray.length > 0) {
    whereQuery = {
      AND: queryArray,
    };
  }

  body = await prisma.user.findMany({
    where: whereQuery,
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
  let status = 401.1;

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

export async function getUserProfileNotes(username: string): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;

  const response = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      uuid: true,
      username: true,
      role: true,
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          author: { select: limitedUserSelect },
          approved: true,
          content: true,
          createdAt: true,
          paint: {
            select: {
              manufacturer: {
                select: {
                  name: true,
                },
              },
              name: true,
              slug: true,
              uuid: true,
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

export async function getUserProfileSwatches(username: string): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;

  const response = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      uuid: true,
      username: true,
      swatchCards: {
        orderBy: {
          createdAt: 'desc',
        },
        select: swatchCardSelect,
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

export async function createPaint(
  data,
  user,
): Promise<{
  status: number;
  body: Record<string, unknown>;
}> {
  let body = {};
  let status = 500;

  const uuid = generateUuid();
  const slug = generateSlug({ value: data.name, uuid: false });
  const lineSelect =
    data.line.id !== null
      ? { connect: { id: Number(data.line.id) } }
      : undefined;

  body = await prisma.paint.create({
    data: {
      published: data.published,
      author: { connect: { uuid: user.uuid } },
      uuid: uuid,
      slug: slug,
      manufacturer: { connect: { name: data.manufacturer.name } },
      paintType: { connect: { id: 1 } },
      line: lineSelect,
      name: data.name,
      productUrl: data.productUrl ? data.productUrl : undefined,
      hex: data.hex,
      lightfastRating: { connect: { id: 1 } },
      transparencyRating: { connect: { id: 1 } },
      stainingRating: { connect: { id: 1 } },
      granulationRating: { connect: { id: 1 } },
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
      visible: data.visible,
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

export async function getPalettes(): Promise<{
  status: number;
  body: Palette[];
}> {
  return {
    body: await prisma.palette.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        _count: true,
        uuid: true,
        visible: true,
        slug: true,
        title: true,
        owner: {
          select: limitedUserSelect,
        },
      },
    }),
    status: 200,
  };
}

export async function getPublicPalettes(): Promise<{
  status: number;
  body: Palette[];
}> {
  return {
    body: await prisma.palette.findMany({
      where: {
        visible: true,
      },
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
      visible: data.visible,
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

export async function deletePalette(uuid: string): Promise<{
  body: { title: string } | null;
  status: number;
}> {
  let body = null;
  let status = 500;

  const deleteRelations = await prisma.paintsInPalette.deleteMany({
    where: {
      paletteUuid: uuid,
    },
  });

  if (deleteRelations !== null) {
    body = await prisma.palette.delete({
      where: {
        uuid,
      },
      select: {
        title: true,
      },
    });
  }

  if (body !== null) {
    status = 200;
  }

  return {
    body,
    status,
  };
}
