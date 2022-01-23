<script context="module" lang="ts">
  export async function load({ fetch, url }) {
    const response = await fetch('/palettes.json');
    const { pathname } = url;

    if (response.ok) {
      return {
        props: {
          palettes: await response.json(),
          pathname,
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
  export let pathname;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title="Palettes" {pathname} />

  <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
    {#each palettes as palette}
      <PalettePreview {palette} />
    {/each}
  </div>
</div>
