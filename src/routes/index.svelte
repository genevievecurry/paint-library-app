<script context="module">
  export async function load({ fetch }) {
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

<script lang="ts">
  import Search from '$lib/components/Search.svelte';

  export let paints: ListPaint[];

  function randomDimension() {
    const dimensions = [300, 350, 400, 500, 600];
    return dimensions[Math.floor(Math.random() * dimensions.length)];
  }
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<div class="relative mb-8">
  <div class="absolute h-full w-full bg-gradient-to-t from-black">
    <div class="container mx-auto px-4 sm:px-6 mt-32 mb-20">
      <h1 class="text-white font-bold text-5xl">Paint Library</h1>
      <p class="text-white text-xl font-light mt-6">
        Paint Library is an online database of artists paints and pigments.
      </p>
      <div class="w-full mt-8">
        <Search />
      </div>
    </div>
  </div>
  <img
    class="object-cover w-full min-h-screen lg:min-h-0 lg:max-h-112"
    src="/kseniya-lapteva-qgWQuzpazWw-unsplash.jpg"
    alt="" />
</div>

<div class="container mx-auto px-4 sm:px-6">
  <div
    class="masonry sm:masonry-sm md:masonry-md lg:masonry-lg xl:masonry-xl 2xl:masonry-2xl">
    {#each paints as paint}
      <div class="table border border-black p-3 break-inside mb-3 w-full">
        <a sveltekit:prefetch href={`paint/${paint.slug}`}>
          <div
            class="w-full block"
            style={`background-color: ${
              paint.hex
            }; height: ${randomDimension()}px`}>
            <!-- To-do: Figure out how to pull in a swatch image, if there is one. -->
          </div>
          <div class="mt-2">
            <span class="block font-medium">{paint.manufacturer.name}</span>
            <span class="block text-sm">{paint.productColorName}</span>
          </div>
        </a>
      </div>
    {/each}
  </div>
</div>
