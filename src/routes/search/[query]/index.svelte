<script context="module">
  export async function load({ page, fetch }) {
    const url = `/search/${page.params.query}.json`;
    const response = await fetch(url);

    if (response.ok) {
      return {
        props: {
          results: await response.json(),
          query: page.params.query,
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
  export let results: SearchResults;
  export let query: string;

  $: unsluggedQuery = query.replace('-', ' ');
  $: count = results.count;
  $: paints = results.paints;

  function randomDimension() {
    const dimensions = [300, 350, 400, 500, 600];
    return dimensions[Math.floor(Math.random() * dimensions.length)];
  }
</script>

<header class="my-6">
  <div>
    <h1 class="font-extrabold text-4xl">
      {unsluggedQuery}
    </h1>
    <span class="block mt-2">Results: {count}</span>
  </div>
</header>

<div
  class="masonry sm:masonry-sm md:masonry-md lg:masonry-lg xl:masonry-xl 2xl:masonry-2xl">
  {#each paints as paint (paint)}
    <div class="table border border-black p-3 break-inside mb-3 w-full">
      <a sveltekit:prefetch href="{`/paint/${paint.slug}`}">
        <div
          class="w-full block"
          style="{`background-color: ${
            paint.hex
          }; height: ${randomDimension()}px`}">
          <!-- To-do: Figure out how to pull in a swatch image, if there is one. -->
        </div>
        <div class="mt-2">
          <span class="block font-medium">{paint.manufacturer.name}</span>
          <span class="block text-sm">{paint.name}</span>
        </div>
      </a>
    </div>
  {/each}
</div>
