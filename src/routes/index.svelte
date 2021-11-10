<script context="module">
  export async function load({ page, fetch }) {
    const response = await fetch('index.json');

    if (response.ok) {
      return {
        props: {
          swatches: await response.json(),
        },
      };
    }

    return {
      status: response.status,
      error: new Error('Could not load.'),
    };
  }
</script>

<script>
  export let swatches;
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<ul>
  {#each swatches as swatch}
    <li><a sveltekit:prefetch href="{`swatch/${swatch.slug}`}">{swatch.productColorName}</a></li>
  {/each}
</ul>
