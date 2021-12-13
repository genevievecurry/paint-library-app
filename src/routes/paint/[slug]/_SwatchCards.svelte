<style>
  .swatch-card-collection {
    min-height: 400px;
  }
</style>

<script lang="ts">
  import Card from './_Card.svelte';

  export let swatchCardsOnPaint: SwatchCardsCollection;

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
  } = swatchCardsOnPaint;
</script>

<section
  class="swatch-card-collection grid gap-3 grid-cols-1 grid-rows-9 sm:grid-cols-3 sm:grid-rows-3 md:grid-cols-5">
  <Card {...masstone} tall="{true}" />
  <Card {...gradient} tall="{true}" />
  <Card {...highDilution} tall="{true}" />

  <Card {...midDilution} tall="{false}" />
  <Card {...granulation} tall="{false}" />
  <Card {...dispersement} tall="{false}" />

  <Card {...glaze} tall="{false}" />
  <Card {...wetLift} tall="{false}" />
  <Card {...dryLift} tall="{false}" />
</section>
