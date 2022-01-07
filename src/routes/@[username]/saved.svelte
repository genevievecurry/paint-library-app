<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const url = `/@${params.username}/saved.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          paletteData: await response.json(),
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
  import PalettePreview from '$lib/components/PalettePreview.svelte';

  export let paletteData;

  $: data = paletteData;
</script>

<div class="grid grid-cols-3 gap-6">
  {#each data.savedPalettes as savedPalette}
    <PalettePreview palette={savedPalette.palette} />
  {/each}
</div>
