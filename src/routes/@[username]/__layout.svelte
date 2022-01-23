<script context="module">
  export async function load({ params, fetch, url }) {
    const response = await fetch(`/@${params.username}.json`);
    const { pathname } = url;
    if (response.ok) {
      return {
        props: {
          userData: await response.json(),
          pathname,
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

  export let userData;
  export let pathname;

  $: user = userData;
</script>

<div class="container mx-auto px-4 sm:px-6">
  <Header title="@{user.username}" />

  <div class="border-b mb-10">
    <ul class="flex">
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/palettes`}
        id="ownedPalettes">
        <a href="palettes" class="block py-3 px-6"
          >Palettes {userData._count.ownedPalettes}</a
        ></li>
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/saved`}
        id="savedPalettes">
        <a href="saved" class="block py-3 px-6"
          >Saved {userData._count.savedPalettes}</a
        ></li>
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/swatches`}
        id="swatchCards">
        <a href="swatches" class="block py-3 px-6"
          >Swatch Cards {userData._count.swatchCards}</a
        ></li>
      <li
        class="border-b-4 transition-colors hover:text-teal-600 hover:border-gray-300"
        class:current={pathname === `/@${user.username}/notes`}
        id="notes">
        <a href="notes" class="block py-3 px-6">Notes {userData._count.notes}</a
        ></li>
    </ul>
  </div>

  <slot />
</div>

<style>
  .current {
    @apply border-black;
  }
</style>
