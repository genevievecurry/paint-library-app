<script>
  export let communityDescription;
  export let manufacturerDescription;
  export let manufacturerPigmentDescription;
  export let manufacturerName;
</script>

{#if manufacturerDescription}
  <section class="mt-8">
    <h2 class="font-bold text-2xl">Manufacturer Description</h2>
    <span class="text-xs text-gray-500 mt-4 block">From {manufacturerName}:</span>
    <div class="mt-2">{@html manufacturerDescription}</div>
    <div>{manufacturerPigmentDescription}</div>
  </section>
{/if}

{#if communityDescription}
  <section class="mt-8">
    <h2 class="font-bold text-2xl">Community Description</h2>
    <div class="mt-2">{@html communityDescription}</div>
  </section>
{/if}
