<script context="module">
  export async function load({ page, fetch }) {
    const url = `/paint/${page.params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: page.params.slug,
          paint: await response.json(),
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script lang="ts">
  import { setContext } from 'svelte';
  import SwatchCards from './_SwatchCards.svelte';
  import Header from './_Header.svelte';
  import Ratings from './_Ratings.svelte';
  import Description from './_Description.svelte';
  import Pigments from './_Pigments.svelte';
  // import Tags from './_Tags.svelte';
  import Notes from './_Notes.svelte';
  // import type { Paint, Manufacturer, LightfastRating, TransparencyRating, StainingRating, GranulationRating, Pigment } from '.prisma/client';

  // interface PaintComponent extends Paint {
  //   manufacturer: Manufacturer
  //   swatchCardsOnPaint: SwatchCardsCollection
  //   lightfastRating: LightfastRating
  //   transparencyRating: TransparencyRating
  //   stainingRating: StainingRating
  //   granulationRating: GranulationRating
  //   pigmentsOnPaints: { pigment: Pigment;}[]
  //   notes: Notes
  // }

  export let slug: string;
  export let paint: PaintComponent;

  setContext('slug', slug);
  setContext('editable', true);

  if (paint) setContext('hex', paint.hex);
</script>

{#if paint}
  <Header title="{paint.productColorName}" manufacturerName="{paint.manufacturer?.name}" />
  <SwatchCards swatchCardsOnPaint="{paint.swatchCardsOnPaint}" />
  <div class="flex">
    <div class="flex-auto">
      <Ratings
        lightfastRating="{paint.lightfastRating}"
        transparencyRating="{paint.transparencyRating}"
        stainingRating="{paint.stainingRating}"
        granulationRating="{paint.granulationRating}"
      />
      <Description
        communityDescription="{paint.communityDescription}"
        manufacturerDescription="{paint.manufacturerDescription}"
        manufacturerPigmentDescription="{paint.manufacturerPigmentDescription}"
        manufacturerName="{paint.manufacturer?.name}"
      />
    </div>
    <div class="flex-none w-96 pl-8">
      <Pigments pigmentsOnPaints="{paint.pigmentsOnPaints}" />
      <!-- <Tags tags="{paint.tags}" /> -->
    </div>
  </div>
  <Notes notes="{paint.notes}" />
{:else}
  LOADING!
{/if}
