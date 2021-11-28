<script context="module">
  export async function load({ page, fetch }) {
    const response = await fetch('index.json');

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

<script>
  export let paints;
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<ul>
  {#each paints as paint}
    <li><a sveltekit:prefetch href="{`paint/${paint.slug}`}">{paint.productColorName}</a></li>
  {/each}
</ul>
