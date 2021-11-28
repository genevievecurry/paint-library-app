<script context="module">
  export async function load({ page, fetch }) {
    const url = `/paint/${page.params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: page.params.slug,
          paintData: await response.json(),
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script>
  import { setContext } from 'svelte';
  import SwatchCards from './_SwatchCards.svelte';
  import Header from './_Header.svelte';
  import Ratings from './_Ratings.svelte';
  import Description from './_Description.svelte';
  import Pigments from './_Pigments.svelte';
  // import Tags from './_Tags.svelte';
  import Notes from './_Notes.svelte';

  export let slug;
  export let paintData;

  setContext('slug', slug);
  setContext('editable', true);

  if (paintData) setContext('hex', paintData.hex);
</script>

{#if paintData}
  <Header title="{paintData.productColorName}" manufacturerName="{paintData.manufacturer?.name}" />
  <SwatchCards swatchCardData="{paintData.swatchCardsOnPaint}" />
  <div class="flex">
    <div class="flex-auto">
      <Ratings
        lightfastRating="{paintData.lightfastRating}"
        transparencyRating="{paintData.transparencyRating}"
        stainingRating="{paintData.stainingRating}"
        granulationRating="{paintData.granulationRating}"
      />
      <Description
        communityDescription="{paintData.communityDescription}"
        manufacturerDescription="{paintData.manufacturerDescription}"
        manufacturerPigmentDescription="{paintData.manufacturerPigmentDescription}"
        manufacturerName="{paintData.manufacturer?.name}"
      />
    </div>
    <div class="flex-none w-96 pl-8">
      <Pigments pigments="{paintData.pigments}" />
      <!-- <Tags tags="{paintData.tags}" /> -->
    </div>
  </div>
  <Notes notes="{paintData.notes}" />
{:else}
  LOADING!
{/if}
