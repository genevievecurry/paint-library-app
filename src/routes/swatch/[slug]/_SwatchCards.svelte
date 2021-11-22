<style>
  .swatch-card-collection {
    @apply grid gap-1;
    min-height: 400px;
  }
</style>

<script lang="ts">
  export let swatchCardData;
  import SwatchCard from './_SwatchCard.svelte';

  const {
    gradient,
    granulation,
    dispersement,
    highDilution,
    midDilution,
    masstone,
    glaze,
    wetLift,
    dryLift,
  } = swatchCardData;
</script>

<section
  class="swatch-card-collection grid grid-cols-1 grid-rows-9 sm:grid-cols-3 sm:grid-rows-3 md:grid-cols-5"
>
  <SwatchCard {...masstone} tall="{true}" />
  <SwatchCard {...gradient} tall="{true}" />
  <SwatchCard {...highDilution} tall="{true}" />

  <SwatchCard {...midDilution} tall="{false}" />
  <SwatchCard {...granulation} tall="{false}" />
  <SwatchCard {...dispersement} tall="{false}" />

  <SwatchCard {...glaze} tall="{false}" />
  <SwatchCard {...wetLift} tall="{false}" />
  <SwatchCard {...dryLift} tall="{false}" />
</section>
