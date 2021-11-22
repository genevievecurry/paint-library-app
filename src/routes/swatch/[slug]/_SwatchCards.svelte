<script lang="ts">
  export let swatchCardData;
  import SwatchCard from './_SwatchCard.svelte';

  const { gradient, granulation, dispersement, highDilution, midDilution, masstone, glaze, wetLift, dryLift } = swatchCardData;

</script>

<section class="swatch-card-collection">

  <SwatchCard {...gradient} focus={true} />

  <SwatchCard {...granulation} focus={false} />
  <SwatchCard {...dispersement} focus={false} />
  <SwatchCard {...highDilution} focus={false} />
  <SwatchCard {...midDilution} focus={false} />

  <SwatchCard {...masstone} focus={false} />
  <SwatchCard {...glaze} focus={false} />
  <SwatchCard {...wetLift} focus={false} />
  <SwatchCard {...dryLift} focus={false} />

</section>

<style>
  .swatch-card-collection{
    @apply grid grid-cols-3 gap-1;
  }
</style>