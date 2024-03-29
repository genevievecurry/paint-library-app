/// <reference types="@sveltejs/kit" />
interface Locals {
  user: User;
}

type Action = (
  node: HTMLElement,
  parameters: any,
) => {
  update?: (parameters: any) => void;
  destroy?: () => void;
};

declare type LoadInput = import('@sveltejs/kit').LoadInput;
declare type RequestEvent = import('@sveltejs/kit').RequestEvent;
declare type RequestHandler = import('@sveltejs/kit').RequestHandler;

declare type Paint = import('.prisma/client').Paint;
declare type Pigment = import('.prisma/client').Pigment;
declare type SwatchCard = import('.prisma/client').SwatchCard;
declare type Color = import('.prisma/client').Color;
declare type LightfastRating = import('.prisma/client').LightfastRating;
declare type TransparencyRating = import('.prisma/client').TransparencyRating;
declare type StainingRating = import('.prisma/client').StainingRating;
declare type GranulationRating = import('.prisma/client').GranulationRating;
declare type Palette = import('.prisma/client').Palette;
declare type PaintsInPalette = import('.prisma/client').PaintsInPalette;
declare type PaperType = import('.prisma/client').PaperType;
declare type Line = import('.prisma/client').Line;
declare type Note = import('.prisma/client').Note;

declare type SwatchCardTypesOnSwatchCard =
  import('.prisma/client').SwatchCardTypesOnSwatchCard;

interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_IMAGEKIT_PUBLIC_API_KEY: string;
  readonly VITE_IMAGEKIT_PRIVATE_API_KEY: string;
  readonly VITE_SENDGRID_API_KEY: string;
  readonly VITE_SENDER_EMAIL: string;
  readonly VITE_SENDER_NAME: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface SwatchCardTypesOnSwatchCardComponent
  extends SwatchCardTypesOnSwatchCard {
  swatchCardType: import('.prisma/client').SwatchCardType;
}

interface SwatchCardComponent extends SwatchCard {
  swatchCardType: import('.prisma/client').SwatchCardType;
  paperManufacturer: import('.prisma/client').Manufacturer;
  paperLine: Line;
  paperType: PaperType;
  paperWeightInLbs: number;
  author: import('.prisma/client').User;
  imageKitUpload: import('.prisma/client').ImageKitUpload;
  tags: import('.prisma/client').Tag[];
  isOriginal: boolean;
  primaryOnPaintUuid: string;
  swatchCardTypesOnSwatchCard: SwatchCardTypesOnSwatchCardComponent[];
}
interface PaintComponent extends Paint {
  uuid: string;
  line?: Line;
  swatchCard?: SwatchCardComponent[];
  pigmentsOnPaints?: { pigment: Pigment }[];
  manufacturer?: import('.prisma/client').Manufacturer;
  lightfastRating?: import('.prisma/client').LightfastRating;
  transparencyRating?: import('.prisma/client').TransparencyRating;
  stainingRating?: import('.prisma/client').StainingRating;
  granulationRating?: import('.prisma/client').GranulationRating;
  notes?: import('.prisma/client').Notes;
  primarySwatchCard: SwatchCardComponent;
  _count: {
    swatchCard: number;
  };
}

type ListPaint = {
  uuid: string;
  slug: string;
  hex: string;
  name: string;
  published: boolean;
  manufacturer: {
    name: string;
  };
};

type ListPigment = {
  slug: string;
  hex?: string;
  name: string;
  number?: number;
  type: string;
  colorCode: string;
  lightfastRating: LightfastRating;
  transparencyRating: TransparencyRating;
};

type SearchResults = {
  count: number;
  paints: ListPaint[];
};

type PigmentPaints = {
  paint: ListPaint;
}[];

interface PigmentComponent extends Pigment {
  color?: Color;
  paints: PigmentPaints;
  imageKitUpload: import('.prisma/client').ImageKitUpload;
  number: number;
}

type PigmentListingByColor = {
  label: string;
  slug: string;
  hex: string;
  _count: {
    pigments: number;
  };
  pigments: ListPigment[];
};

type User = {
  slug: string;
  username: string;
  firstName: string;
  lastName: string;
  uuid: string;
  email: string;
  role: string;
  status: string;
};

type DisplayUser = {
  slug: string;
  username: string;
  role: string;
  status: string;
  uuid: string;
};

interface PaintsInPaletteComponent extends PaintsInPalette {
  paint: Paint;
}

interface PaletteComponent extends Palette {
  paintsInPalette?: PaintsInPaletteComponent[];
  owner: DisplayUser;
  savedByUser: boolean;
}

interface NoteComponent extends Note {
  author: User;
  paint: Paint;
}

type PaletteListing = {
  palettes: Palette[];
};
