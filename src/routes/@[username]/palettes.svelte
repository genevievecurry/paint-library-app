<script context="module" lang="ts">
  export async function load({ page, session, fetch }) {
    const url = `/@${page.params.username}/palettes.json`;
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
  {#each data.ownedPalettes as ownedPalette}
    <PalettePreview palette={ownedPalette} />
  {/each}
</div>
