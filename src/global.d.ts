/// <reference types="@sveltejs/kit" />

declare type Paint = import('.prisma/client').Paint;
declare type Pigment = import('.prisma/client').Pigment;
declare type SwatchCard = import('.prisma/client').SwatchCard;
interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_IMAGEKIT_PUBLIC_API_KEY: string;
  readonly VITE_IMAGEKIT_PRIVATE_API_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface SwatchCardComponent extends SwatchCard {
  swatchCardType: import('.prisma/client').SwatchCardType;
  paper: import('.prisma/client').Paper;
  author: import('.prisma/client').User;
  imageKitUpload: import('.prisma/client').ImageKitUpload;
}

interface SwatchCardsCollection {
  gradient: SwatchCardComponent;
  granulation: SwatchCardComponent;
  dispersement: SwatchCardComponent;
  highDilution: SwatchCardComponent;
  midDilution: SwatchCardComponent;
  masstone: SwatchCardComponent;
  glaze: SwatchCardComponent;
  wetLift: SwatchCardComponent;
  dryLift: SwatchCardComponent;
}
interface PaintComponent extends Paint {
  swatchCardsOnPaint?: SwatchCardsCollection;
  pigmentsOnPaints?: { pigment: Pigment }[];
  manufacturer?: import('.prisma/client').Manufacturer;
  lightfastRating?: import('.prisma/client').LightfastRating;
  transparencyRating?: import('.prisma/client').TransparencyRating;
  stainingRating?: import('.prisma/client').StainingRating;
  granulationRating?: import('.prisma/client').GranulationRating;
  notes?: import('.prisma/client').Notes;
}

type ListPaints = {
  slug: string;
  hex: string;
  productColorName: string;
  manufacturer: {
    name: string;
  };
}[];

type SearchResults = {
  count: number;
  paints: ListPaints;
};
