<script context="module">
  export async function load({ page }) {
    const { params } = page;

    return {
      props: {
        searchQuery: params.searchQuery,
      },
    };
  }
</script>

<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import PaintPreview from '$lib/components/PaintPreview.svelte';
  import InfiniteLoad from '$lib/components/InfiniteLoad.svelte';

  export let searchQuery: string;

  $: searchQuery = searchQuery;
  $: unsluggedQuery = searchQuery.replace('-', ' ');
  $: count = 0;
  $: set = 0;
  $: list = [];

  let infiniteId = +new Date();
  let staticQuery = searchQuery;

  function updateInfiniteId() {
    if (staticQuery !== searchQuery) {
      set = 0;
      list = [];
      infiniteId += 1;
      infiniteId = infiniteId;
    }
  }

  $: searchQuery, updateInfiniteId();

  function infiniteHandler({ detail: { loaded, complete } }) {
    fetch(`/search/${searchQuery}.json?set=${set}`)
      .then((response) => response.json())
      .then((data) => {
        count = data.count;
        if (data.paints.length) {
          set += 50;
          list = [...list, ...data.paints];
          loaded();
        } else {
          complete();
        }
      });
  }
</script>

<Header title={unsluggedQuery} subtitle={`${count} results`} />

<div
  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-3"
  infinite-wrapper>
  {#each list as paint, index}
    <PaintPreview {paint} {index} />
  {/each}

  <InfiniteLoad
    on:infinite={infiniteHandler}
    identifier={infiniteId}
    forceUseInfiniteWrapper />
</div>