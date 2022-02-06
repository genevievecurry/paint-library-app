<script context="module" lang="ts">
  export async function load({ fetch }) {
    const response = await fetch(`index.json?take=30`);

    if (response.ok) {
      return {
        props: {
          paints: await response.json(),
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
  import Search from '$lib/components/Search.svelte';
  import PaintPreview from '$lib/components/PaintPreview.svelte';

  export let paints;
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<div class="w-full">
  <div class="lg:container mx-auto py-16 px-4 sm:px-6">
    <h1 class="font-bold text-5xl">Paint Library</h1>
    <p class="text-xl font-light mt-6">
      Paint Library is an online database of artist paint swatches.
    </p>
    <div class="w-full mt-8">
      <Search />
    </div>
  </div>
</div>

<div class="lg:container mx-auto px-4 sm:px-6">
  <h2 class="font-bold text-3xl mb-6">Recently Added Paints</h2>
  <div
    class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3">
    {#each paints as paint, index}
      <PaintPreview {paint} {index} />
    {/each}
  </div>
</div>
