<script context="module" lang="ts">
  export async function load({ page, session, fetch }) {
    const url = `/@${page.params.userSlug}/palettes.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          data: await response.json(),
          editable: false,
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

  export let data;
  export let editable: boolean;

  const { ownedPalettes } = data;
</script>

<div class="grid grid-cols-3 gap-6">
  {#each ownedPalettes as ownedPalette}
    <PalettePreview palette={ownedPalette} />
  {/each}
</div>
