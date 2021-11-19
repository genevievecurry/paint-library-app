<script lang="ts">
  export let swatchCardData;
  import SwatchCard from './_SwatchCard.svelte';

  const { gradient, granulation, dispersement, highDilution, midDilution, masstone, glaze, wetLift, dryLift } = swatchCardData;

</script>

<section class="swatch-card-collection">
  <div>
    <SwatchCard {...gradient} size={350}></SwatchCard>
  </div>
  <div>
    {#if granulation}<SwatchCard {...granulation} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
    {#if dispersement}<SwatchCard {...dispersement} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
    {#if highDilution}<SwatchCard {...highDilution} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
    {#if midDilution}<SwatchCard {...midDilution} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
  </div>
  <div>
    {#if masstone}<SwatchCard {...masstone} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
    {#if glaze}<SwatchCard {...glaze} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
    {#if wetLift}<SwatchCard {...wetLift} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
    {#if dryLift}<SwatchCard {...dryLift} size={80}></SwatchCard>{:else}<div>...dust</div>{/if}
  </div>
</section>

<style>
  .swatch-card-collection{
    display: flex;
  }
</style>