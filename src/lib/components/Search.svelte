<script lang="ts">
  import { goto } from '$app/navigation';
  import { generateSlug } from '$lib/generate';
  import { searchIcon } from '$lib/icons';

  export let reverse: boolean = false;

  let searchQuery: string;

  function resetQuery() {
    searchQuery = '';
  }

  async function handleQuery() {
    const sluggedQuery = generateSlug({ value: searchQuery, uuid: false });
    goto(`/search/${sluggedQuery}`);
    resetQuery();
  }
</script>

<form
  on:submit|preventDefault={handleQuery}
  class="w-full flex align-middle border-2 {reverse
    ? 'bg-gray-900 border-white text-white'
    : 'bg-white  border-black text-black'} focus:outline-none focus:ring-lime-500 focus:border-lime-500">
  <button class="p-3 flex-none">
    {@html searchIcon()}
  </button>

  <input
    class="flex-grow font-light py-2 px-3 {reverse
      ? 'bg-gray-900 border-white text-white'
      : 'bg-white  border-black text-black'}"
    bind:value={searchQuery}
    placeholder="Search Paints" />
</form>
