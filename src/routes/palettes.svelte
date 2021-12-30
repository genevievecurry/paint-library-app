<script context="module" lang="ts">
  export async function load({ fetch }) {
    const response = await fetch('/palettes.json');

    if (response.ok) {
      return {
        props: {
          palettes: await response.json(),
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
  import Header from '$lib/components/Header.svelte';
  import PalettePreview from '$lib/components/PalettePreview.svelte';
  export let palettes;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title="Palettes"></Header>

  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
    {#each palettes as palette}

        <PalettePreview {palette} />

    {/each}
  </div>
</div>
