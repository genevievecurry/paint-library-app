<script lang="ts">
  import Search from '$lib/components/Search.svelte';
  import PaintPreview from '$lib/components/PaintPreview.svelte';
  import InfiniteLoad from '$lib/components/InfiniteLoad.svelte';

  let set = 0;
  let list = [];

  function infiniteHandler({ detail: { loaded, complete } }) {
    fetch(`index.json?set=${set}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length) {
          set += 50;
          list = [...list, ...data];
          loaded();
        } else {
          complete();
        }
      });
  }
</script>

<svelte:head>
  <title>Paint Library</title>
</svelte:head>

<div class="relative mb-8">
  <div class="absolute h-full w-full bg-gradient-to-t from-black ">
    <div class="lg:container mx-auto px-4 sm:px-6 mt-32 mb-20">
      <h1 class="text-white font-bold text-5xl">Paint Library</h1>
      <p class="text-white text-xl font-light mt-6">
        Paint Library is an online database of artist paint swatches.
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

<div class="lg:container mx-auto px-4 sm:px-6">
  <div
    class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-3"
    infinite-wrapper>
    {#each list as paint, index}
      <PaintPreview {paint} {index} />
    {/each}
    <InfiniteLoad on:infinite={infiniteHandler} forceUseInfiniteWrapper />
  </div>
</div>
