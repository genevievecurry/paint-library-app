<script context="module">
  export async function load({ page, fetch }) {
    const url = `/swatch/${page.params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          swatchData: await response.json(),
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
  import SwatchCards from './_SwatchCards.svelte';
  import SwatchHeader from './_Header.svelte';
  import SwatchRatings from './_Ratings.svelte';
  import SwatchDescription from './_Description.svelte';
  import SwatchPigments from './_Pigments.svelte';
  // import SwatchTags from './_Tags.svelte';
  import SwatchNotes from './_Notes.svelte';

  export let swatchData;
</script>

<SwatchHeader
  title="{swatchData.productColorName}"
  manufacturerName="{swatchData.manufacturer?.name}"
/>
<SwatchCards swatchCardData="{swatchData.swatchCardsOnSwatch}" />
<div class="flex">
  <div class="flex-auto">
    <SwatchRatings
      lightfastRating="{swatchData.lightfastRating}"
      transparencyRating="{swatchData.transparencyRating}"
      stainingRating="{swatchData.stainingRating}"
      granulationRating="{swatchData.granulationRating}"
    />
    <SwatchDescription
      communityDescription="{swatchData.communityDescription}"
      manufacturerDescription="{swatchData.manufacturerDescription}"
      manufacturerPigmentDescription="{swatchData.manufacturerPigmentDescription}"
      manufacturerName="{swatchData.manufacturer?.name}"
    />
  </div>
  <div class="flex-none w-96 pl-8">
    <SwatchPigments pigments="{swatchData.pigments}" />
    <!-- <SwatchTags tags="{swatchData.tags}" /> -->
  </div>
</div>
<SwatchNotes notes="{swatchData.notes}" />
