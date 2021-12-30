<script lang="ts">
  import { goto } from '$app/navigation';
  import { generateSlug } from '$lib/slug';

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
  class="w-full flex align-middle border {reverse
    ? 'bg-gray-900 border-white'
    : 'bg-white  border-black'} focus:outline-none focus:ring-green-400 focus:border-green-400">
  <button class="p-3 flex-none">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke={reverse ? 'white' : 'black'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
      <path
        d="M21 21L16.65 16.65"
        stroke={reverse ? 'white' : 'black'}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
  </button>

  <input
    class="flex-grow font-light py-2 px-3 {reverse
      ? 'bg-gray-900 border-white text-white'
      : 'bg-white  border-black text-black'}"
    bind:value={searchQuery}
    placeholder="Search Paints" />
</form>
