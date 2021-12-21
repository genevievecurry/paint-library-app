<script context="module" lang="ts">
  export async function load({ page, fetch }) {
    const url = `/palette/${page.params.slug}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          slug: page.params.slug,
          palette: await response.json(),
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
  export let palette;

  const { title, owner, description, paintsInPalette } = palette;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header {title} {owner} {description} />

  <section
    class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
    {#each paintsInPalette as paintInPalette}
      <div class="border border-black p-1">
        <a sveltekit:prefetch href={`/paint/${paintInPalette.paint.slug}`}>
          <div
            class="w-full h-32"
            style={`background-color: ${paintInPalette.paint.hex}`} />
        </a>
      </div>
    {/each}
  </section>
</div>
